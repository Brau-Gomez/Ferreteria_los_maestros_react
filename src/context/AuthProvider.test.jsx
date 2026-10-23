import { act, renderHook } from '@testing-library/react';
import { AuthProvider } from './AuthProvider.jsx';
import { useSesion } from '../hooks/useSesion.js';
import { huellaClave } from '../utils/claves.js';

// Mock del módulo de claves: evita el cálculo PBKDF2 (lento) y permite
// controlar la huella que "devuelve" el navegador.
vi.mock('../utils/claves.js', () => ({
  huellaClave: vi.fn(),
}));

const usuarioDemo = {
  run: '222222222', nombre: 'Cliente', apellidos: 'Demo', correo: 'cliente@gmail.com',
  tipoUsuario: 'Cliente', activo: true,
};
const usuarioConClave = {
  run: '333333333', nombre: 'Luis', apellidos: 'Soto', correo: 'luis@gmail.com',
  tipoUsuario: 'Cliente', activo: true, sal: 'sal-1', claveHuella: 'huella-correcta',
};

function montar() {
  return renderHook(() => useSesion(), { wrapper: AuthProvider });
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('ep1-users', JSON.stringify([usuarioDemo, usuarioConClave]));
    huellaClave.mockReset();
  });

  it('inicia sin usuario si no hay sesión guardada', () => {
    const { result } = montar();
    expect(result.current.usuario).toBeNull();
  });

  it('recupera la sesión guardada al montar', () => {
    localStorage.setItem('ep1-user', JSON.stringify({ run: '222222222' }));
    const { result } = montar();
    expect(result.current.usuario.correo).toBe('cliente@gmail.com');
  });

  it('entra con la clave demo y guarda la sesión', async () => {
    const { result } = montar();
    let respuesta;
    await act(async () => {
      respuesta = await result.current.entrar('cliente@gmail.com', 'demo123');
    });
    expect(respuesta.ok).toBe(true);
    expect(result.current.usuario.run).toBe('222222222');
    expect(JSON.parse(localStorage.getItem('ep1-user'))).toEqual({ run: '222222222' });
  });

  it('rechaza una clave incorrecta', async () => {
    const { result } = montar();
    let respuesta;
    await act(async () => {
      respuesta = await result.current.entrar('cliente@gmail.com', 'mala123');
    });
    expect(respuesta).toEqual({ ok: false, mensaje: 'Correo o contraseña incorrectos.' });
    expect(result.current.usuario).toBeNull();
  });

  it('con huella guardada compara contra la huella calculada (mock)', async () => {
    huellaClave.mockResolvedValue('huella-correcta');
    const { result } = montar();
    let respuesta;
    await act(async () => {
      respuesta = await result.current.entrar('luis@gmail.com', 'clave1');
    });
    expect(huellaClave).toHaveBeenCalledWith('clave1', 'sal-1');
    expect(respuesta.ok).toBe(true);
  });

  it('con huella distinta rechaza el ingreso', async () => {
    huellaClave.mockResolvedValue('otra-huella');
    const { result } = montar();
    let respuesta;
    await act(async () => {
      respuesta = await result.current.entrar('luis@gmail.com', 'clave1');
    });
    expect(respuesta.ok).toBe(false);
  });

  it('avisa si el navegador no puede calcular la huella', async () => {
    huellaClave.mockRejectedValue(new Error('sin crypto.subtle'));
    const { result } = montar();
    let respuesta;
    await act(async () => {
      respuesta = await result.current.entrar('luis@gmail.com', 'clave1');
    });
    expect(respuesta.mensaje).toMatch(/No se pudo comprobar la contraseña/);
  });

  it('salir borra la sesión', async () => {
    localStorage.setItem('ep1-user', JSON.stringify({ run: '222222222' }));
    const { result } = montar();
    act(() => {
      result.current.salir();
    });
    expect(result.current.usuario).toBeNull();
    expect(JSON.parse(localStorage.getItem('ep1-user'))).toBeNull();
  });
});