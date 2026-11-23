// API de autenticación: login, register, refresh, logout, me
import apiClient from './apiClient.js';

export async function login(email, password) {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
}

export async function register(usuario, password) {
  const nombreCompleto = `${usuario.nombre || ''} ${usuario.apellidos || ''}`.trim();
  const { data } = await apiClient.post('/auth/register', {
    username: usuario.username || usuario.correo || usuario.email,
    email: usuario.correo || usuario.email,
    password,
    fullName: nombreCompleto || usuario.fullName || usuario.nombre || 'Usuario',
    phone: usuario.telefono || usuario.phone || null,
  });
  return data;
}

export async function refresh(refreshToken) {
  const { data } = await apiClient.post('/auth/refresh', { refreshToken });
  return data;
}

export async function logout(refreshToken) {
  await apiClient.post('/auth/logout', { refreshToken });
}

export async function me() {
  const { data } = await apiClient.get('/auth/me');
  return data;
}