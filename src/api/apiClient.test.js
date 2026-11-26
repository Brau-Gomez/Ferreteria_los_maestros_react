import axios from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import apiClient from './apiClient.js';

// Adaptador que siempre responde 401, para simular credenciales incorrectas o sesión vencida.
const responder401 = (config) => Promise.reject(Object.assign(new Error('401'), {
  config,
  response: { status: 401, data: { message: 'Credenciales inválidas' }, config },
}));

describe('apiClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('no intenta renovar el token cuando falla el inicio de sesión', async () => {
    localStorage.setItem('refreshToken', 'token-anterior');
    const refresh = vi.spyOn(axios, 'post');

    await expect(apiClient.post('/auth/login', { email: 'a@b.cl', password: 'x' }, { adapter: responder401 }))
      .rejects.toMatchObject({ response: { status: 401, data: { mensaje: 'Credenciales inválidas' } } });
    expect(refresh).not.toHaveBeenCalled();
  });

  it('intenta renovar el token cuando una ruta privada responde 401', async () => {
    localStorage.setItem('refreshToken', 'token-anterior');
    const refresh = vi.spyOn(axios, 'post').mockRejectedValue(new Error('refresh vencido'));

    await expect(apiClient.get('/orders', { adapter: responder401 })).rejects.toThrow('refresh vencido');
    expect(refresh).toHaveBeenCalledWith(expect.stringContaining('/auth/refresh'), { refreshToken: 'token-anterior' });
  });
});
