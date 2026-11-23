// Proveedor de sesión de la aplicación - MIGRADO A API JWT.
// Usa accessToken en memoria (sessionStorage) y refreshToken en localStorage (httpOnly cookie preferible).
import { useState, useEffect } from 'react';
import { ContextoAuth } from './AuthContext.jsx';
import { login as apiLogin, me as apiMe, logout as apiLogout } from '../api/authApi.js';
import { validarCorreo, validarClave } from '../utils/validaciones/comunes.js';
import { normalizarUsuario } from '../api/usuariosApi.js';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al inicio si hay token
  useEffect(() => {
    async function cargarSesion() {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        const usuarioData = await apiMe();
        setUsuario(normalizarUsuario(usuarioData));
        setIsAuthenticated(true);
      } catch (error) {
        // Token expirado o inválido, el interceptor intentará refresh
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUsuario(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    cargarSesion();
  }, []);

  // Escuchar evento de logout desde el interceptor (refresh fallido)
  useEffect(() => {
    function handleLogout() {
      salir();
    }
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  async function entrar(correo, clave) {
    const errorCorreo = validarCorreo(correo);
    const errorClave = validarClave(clave);
    if (errorCorreo) return { ok: false, mensaje: errorCorreo };
    if (errorClave) return { ok: false, mensaje: errorClave };

    try {
      const respuestaLogin = await apiLogin(correo.trim().toLowerCase(), clave);
      const { accessToken, refreshToken } = respuestaLogin;
      const usuarioData = respuestaLogin.user || respuestaLogin.usuario;
      
      sessionStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const usuarioNormalizado = normalizarUsuario(usuarioData);
      setUsuario(usuarioNormalizado);
      setIsAuthenticated(true);
      
      return { ok: true, mensaje: '', usuario: usuarioNormalizado };
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Correo o contraseña incorrectos.';
      return { ok: false, mensaje };
    }
  }

  function salir() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      apiLogout(refreshToken).catch(() => {});
    }
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUsuario(null);
    setIsAuthenticated(false);
    return true;
  }

  // Actualiza sesión cuando admin edita su perfil
  function actualizarSesion(runAnterior, usuarioActualizado) {
    if (!usuario || usuario.run !== runAnterior) return true;
    if (!usuarioActualizado.activo) {
      salir();
      return true;
    }
    setUsuario(usuarioActualizado);
    return true;
  }

  const valor = { 
    usuario, 
    entrar, 
    salir, 
    actualizarSesion,
    isAuthenticated,
    loading,
  };
  return (
    <ContextoAuth.Provider value={valor}>{children}</ContextoAuth.Provider>
  );
}