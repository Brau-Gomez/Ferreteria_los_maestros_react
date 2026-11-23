// Mock de la API de autenticación - DEBE IR AL PRINCIPIO
import { mockAuthApi } from '../__mocks__/api.js';
vi.mock('../api/authApi.js', () => mockAuthApi);

// Mock de sessionStorage y localStorage
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

vi.stubGlobal('sessionStorage', sessionStorageMock);
vi.stubGlobal('localStorage', localStorageMock);

import { act, renderHook, waitFor } from '@testing-library/react';
import { AuthProvider } from './AuthProvider.jsx';
import { useSesion } from '../hooks/useSesion.js';

const usuarioDemo = {
  run: '222222222', nombre: 'Cliente', apellidos: 'Demo', correo: 'cliente@gmail.com',
  tipoUsuario: 'Cliente', activo: true,
};

function montar(user = null) {
  if (user) {
    sessionStorageMock.setItem('accessToken', 'token');
    mockAuthApi.me.mockResolvedValue(user);
  } else {
    sessionStorageMock.clear();
    mockAuthApi.me.mockRejectedValue(new Error('No session'));
  }
  return renderHook(() => useSesion(), { wrapper: AuthProvider });
}

describe('AuthProvider', () => {
  beforeEach(() => {
    sessionStorageMock.clear();
    localStorageMock.clear();
    mockAuthApi.login.mockReset();
    mockAuthApi.me.mockReset();
    mockAuthApi.logout.mockReset();
    mockAuthApi.login.mockResolvedValue({ accessToken: 'token', refreshToken: 'refresh', usuario: usuarioDemo });
  });

  it('inicia sin usuario si no hay sesión guardada', () => {
    const { result } = montar();
    expect(result.current.usuario).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('recupera la sesión guardada al montar', async () => {
    const { result } = montar(usuarioDemo);
    await waitFor(() => {
      expect(result.current.usuario).not.toBeNull();
    });
    expect(result.current.usuario.correo).toBe('cliente@gmail.com');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('entra con credenciales correctas y guarda tokens', async () => {
    const { result } = montar();
    let respuesta;
    await act(async () => {
      respuesta = await result.current.entrar('cliente@gmail.com', 'demo123');
    });
    expect(respuesta.ok).toBe(true);
    expect(result.current.usuario.run).toBe('222222222');
    expect(sessionStorageMock.getItem('accessToken')).toBe('token');
    expect(localStorageMock.getItem('refreshToken')).toBe('refresh');
  });

  it('rechaza credenciales incorrectas', async () => {
    mockAuthApi.login.mockRejectedValueOnce({ response: { data: { mensaje: 'Correo o contraseña incorrectos.' } } });
    const { result } = montar();
    let respuesta;
    await act(async () => {
      respuesta = await result.current.entrar('cliente@gmail.com', 'mala123');
    });
    expect(respuesta).toEqual({ ok: false, mensaje: 'Correo o contraseña incorrectos.' });
    expect(result.current.usuario).toBeNull();
  });

  it('salir borra la sesión y tokens', async () => {
    const { result } = montar(usuarioDemo);
    await waitFor(() => {
      expect(result.current.usuario).not.toBeNull();
    });
    await act(async () => {
      result.current.salir();
    });
    expect(result.current.usuario).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(sessionStorageMock.getItem('accessToken')).toBeNull();
    expect(localStorageMock.getItem('refreshToken')).toBeNull();
  });

  it('actualizarSesion actualiza el usuario en contexto', async () => {
    const { result } = montar(usuarioDemo);
    await waitFor(() => {
      expect(result.current.usuario).not.toBeNull();
    });
    const usuarioActualizado = { ...usuarioDemo, nombre: 'Nuevo Nombre' };
    await act(async () => {
      const ok = result.current.actualizarSesion(usuarioDemo.run, usuarioActualizado);
      expect(ok).toBe(true);
    });
    expect(result.current.usuario.nombre).toBe('Nuevo Nombre');
  });

  it('actualizarSesion cierra sesión si usuario inactivo', async () => {
    const { result } = montar(usuarioDemo);
    await waitFor(() => {
      expect(result.current.usuario).not.toBeNull();
    });
    const usuarioInactivo = { ...usuarioDemo, activo: false };
    await act(async () => {
      result.current.actualizarSesion(usuarioDemo.run, usuarioInactivo);
    });
    expect(result.current.usuario).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});