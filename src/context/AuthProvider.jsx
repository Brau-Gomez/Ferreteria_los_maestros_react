// Proveedor de sesión de la aplicación.
// Porta la lógica de js/app.js (usuarioDeSesion, cerrarSesion) y de
// js/tienda/inicio-sesion.js (comprobación de credenciales y guardado
// de la sesión).
//
// Como en el original, la sesión en localStorage (ep1-user) solo guarda
// el RUN; el perfil completo se resuelve contra ep1-users en cada carga.
import { useState } from 'react';
import { ContextoAuth } from './AuthContext.jsx';
import {
  clavesDatos,
  guardarDato,
  leerDatoGuardado,
  obtenerUsuarios,
} from '../services/almacenamiento.js';
import { huellaClave } from '../utils/claves.js';
import { validarClave, validarCorreo } from '../utils/validaciones/comunes.js';

// Devuelve el perfil del usuario con sesión activa, o null.
// Se exige que el usuario exista y esté activo (igual que el original).
function usuarioDeSesion() {
  const sesion = leerDatoGuardado(clavesDatos.sesion, null);
  if (!sesion || !sesion.run) return null;
  const usuario = obtenerUsuarios().find((u) => u.run === sesion.run) || null;
  if (!usuario || !usuario.activo) return null;
  return usuario;
}

export function AuthProvider({ children }) {
  // La sesión se lee al inicializar el estado: no hace falta un estado
  // "cargando" y las rutas protegidas no redirigen por error en el
  // primer render.
  const [usuario, setUsuario] = useState(() => usuarioDeSesion());

  // Comprueba credenciales e inicia sesión.
  // Devuelve { ok, mensaje, usuario } para que la página de ingreso
  // decida a dónde redirigir según el rol (el original redirigía:
  // Administrador → panel, Vendedor → listado, Cliente → cuenta).
  async function entrar(correo, clave) {
    const errorCorreo = validarCorreo(correo);
    const errorClave = validarClave(clave);
    if (errorCorreo) return { ok: false, mensaje: errorCorreo };
    if (errorClave) return { ok: false, mensaje: errorClave };

    const correoLimpio = correo.trim().toLowerCase();
    const usuario = obtenerUsuarios().find(
      (u) => u.correo.toLowerCase() === correoLimpio,
    );
    if (!usuario || !usuario.activo) {
      return { ok: false, mensaje: 'Correo o contraseña incorrectos.' };
    }

    // Los perfiles demo y los creados desde el admin usan la clave
    // demo123; los registrados por el sitio guardan su huella PBKDF2.
    if (usuario.claveHuella) {
      try {
        const huella = await huellaClave(clave, usuario.sal);
        if (huella !== usuario.claveHuella) {
          return { ok: false, mensaje: 'Correo o contraseña incorrectos.' };
        }
      } catch {
        // El original pedía "usar Live Server" porque file:// no permite
        // crypto.subtle; con Vite basta localhost, así que el mensaje se
        // adapta al nuevo entorno.
        return {
          ok: false,
          mensaje: 'No se pudo comprobar la contraseña en este navegador.',
        };
      }
    } else if (clave !== 'demo123') {
      return { ok: false, mensaje: 'Correo o contraseña incorrectos.' };
    }

    if (!guardarDato(clavesDatos.sesion, { run: usuario.run })) {
      return {
        ok: false,
        mensaje: 'No se pudo guardar la sesión en este navegador.',
      };
    }
    setUsuario(usuario);
    return { ok: true, mensaje: '', usuario };
  }

  // Cierra la sesión. La redirección al ingreso la hace quien llama
  // (el Header usa navigate), para no acoplar el contexto al router.
  // Devuelve false si el guardado falla.
  function salir() {
    if (!guardarDato(clavesDatos.sesion, null)) return false;
    setUsuario(null);
    return true;
  }

  // Mantiene en sincronía el Context y la clave de sesión cuando Admin edita
  // su propio perfil (el sitio original volvía a resolverlo al recargar).
  function actualizarSesion(runAnterior, usuarioActualizado) {
    if (!usuario || usuario.run !== runAnterior) return true;
    if (!usuarioActualizado.activo) {
      if (!guardarDato(clavesDatos.sesion, null)) return false;
      setUsuario(null);
      return true;
    }
    if (!guardarDato(clavesDatos.sesion, { run: usuarioActualizado.run })) {
      return false;
    }
    setUsuario(usuarioActualizado);
    return true;
  }

  const valor = { usuario, entrar, salir, actualizarSesion };
  return (
    <ContextoAuth.Provider value={valor}>{children}</ContextoAuth.Provider>
  );
}
