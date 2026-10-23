import { act, renderHook } from '@testing-library/react';
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
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('ep1-products', JSON.stringify([{ codigo: 'MC001', nombre: 'Cemento', precioVenta: 1, stock: 1 }]));
  });

  it('lee el catálogo guardado al iniciar', () => {
    const { result } = renderHook(() => useProductos());
    expect(result.current.productos).toHaveLength(1);
  });

  it('se actualiza cuando el catálogo cambia desde otra pestaña', () => {
    const { result } = renderHook(() => useProductos());
    localStorage.setItem(
      'ep1-products',
      JSON.stringify([
        { codigo: 'MC001', nombre: 'Cemento', precioVenta: 1, stock: 1 },
        { codigo: 'HE001', nombre: 'Taladro', precioVenta: 2, stock: 1 },
      ]),
    );
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'ep1-products' }));
    });
    expect(result.current.productos).toHaveLength(2);
  });

  it('ignora cambios de otras claves', () => {
    const { result } = renderHook(() => useProductos());
    localStorage.setItem('ep1-products', JSON.stringify([]));
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'ep1-cart' }));
    });
    expect(result.current.productos).toHaveLength(1);
  });
});