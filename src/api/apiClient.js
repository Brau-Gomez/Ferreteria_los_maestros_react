// Cliente HTTP base con interceptores para autenticación y manejo de errores.
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8180/api';

const getErrorMessage = (error) => (
  error.response?.data?.message
  || error.response?.data?.mensaje
  || error.message
  || 'Ocurrió un error inesperado.'
);

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de petición: adjunta accessToken si existe
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta: maneja 401 con refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.data && typeof error.response.data === 'object') {
      error.response.data.mensaje = getErrorMessage(error);
    }

    // Un 401 en login, registro o refresh significa datos incorrectos, no sesión vencida:
    // no se intenta renovar el token y el error llega directo a la pantalla.
    const esRutaDeSesion = /\/auth\/(login|register|refresh)$/.test(originalRequest?.url || '');

    if (error.response?.status === 401 && !originalRequest._retry && !esRutaDeSesion) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { accessToken } = response.data;

        sessionStorage.setItem('accessToken', accessToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Dispatch event for AuthProvider to handle logout/redirect via React Router
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;