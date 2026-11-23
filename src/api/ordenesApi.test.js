import { vi } from 'vitest';
import apiClient from './apiClient.js';
import { listarOrdenes } from './ordenesApi.js';

vi.mock('./apiClient.js', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}));

it('traduce la orden de la API al formato que lee el panel admin', async () => {
  apiClient.get.mockResolvedValue({
    data: {
      content: [{
        id: '4180ba0c-f39c-46f8-b49e-2c36523a19c6',
        userId: 'user-1',
        status: 'CONFIRMED',
        total: 10698.1,
        createdAt: '2026-11-20T10:00:00Z',
        notes: 'Despacho',
        items: [{ productCode: 'MC001', productName: 'Cemento', quantity: 2, unitPrice: 5349.05 }],
      }],
    },
  });

  const [orden] = await listarOrdenes();

  expect(orden.runUsuario).toBe('user-1');
  expect(orden.delivery).toBe('Despacho');
  expect(orden.productos).toEqual([
    { codigo: 'MC001', nombre: 'Cemento', cantidad: 2, precioVenta: 5349.05 },
  ]);
});
