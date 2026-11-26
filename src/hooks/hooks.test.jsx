import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCarrito } from './useCarrito.js';
import { useProductos } from './useProductos.js';
import { useSesion } from './useSesion.js';

describe('hooks de contexto', () => {
  it('useCarrito falla con un mensaje claro fuera de CartProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useCarrito())).toThrow(/dentro de CartProvider/);
    vi.restoreAllMocks();
  });

  it('useSesion falla con un mensaje claro fuera de AuthProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useSesion())).toThrow(/dentro de AuthProvider/);
    vi.restoreAllMocks();
  });
});

describe('useProductos', () => {
  // Los hooks de datos usan TanStack Query: se prueban con su proveedor.
  function envoltura() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    return ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }

  beforeEach(() => {
    localStorage.setItem('ep1-products', JSON.stringify([
      { codigo: 'MC001', nombre: 'Cemento', precioVenta: 5990, stock: 10 },
    ]));
  });

  it('lee el catálogo desde la API', async () => {
    const { result } = renderHook(() => useProductos(), { wrapper: envoltura() });
    await waitFor(() => expect(result.current.productos).toHaveLength(1));
    expect(result.current.productos[0]).toMatchObject({ codigo: 'MC001', precioVenta: 5990 });
  });

  it('al refrescar trae los cambios del backend', async () => {
    const { result } = renderHook(() => useProductos(), { wrapper: envoltura() });
    await waitFor(() => expect(result.current.productos).toHaveLength(1));
    localStorage.setItem('ep1-products', JSON.stringify([
      { codigo: 'MC001', nombre: 'Cemento', precioVenta: 1, stock: 1 },
      { codigo: 'HE001', nombre: 'Taladro', precioVenta: 2, stock: 1 },
    ]));
    await act(() => result.current.refetch());
    await waitFor(() => expect(result.current.productos).toHaveLength(2));
  });

  it('no muestra los productos desactivados (eliminados) en el backend', async () => {
    localStorage.setItem('ep1-products', JSON.stringify([
      { codigo: 'MC001', nombre: 'Cemento', precioVenta: 1, stock: 1 },
      { codigo: 'HE001', nombre: 'Taladro', precioVenta: 2, stock: 1, activo: false },
    ]));
    const { result } = renderHook(() => useProductos(), { wrapper: envoltura() });
    await waitFor(() => expect(result.current.productos).toHaveLength(1));
    expect(result.current.productos[0].codigo).toBe('MC001');
  });
});
