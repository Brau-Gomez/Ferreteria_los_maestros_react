import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductosContainer from '@/containers/catalogo/ProductosContainer.jsx';
import { useCarrito } from '@/hooks/useCarrito.js';

// Mock del hook del carrito: el container se prueba aislado de CartProvider
// y de localStorage, controlando qué responde "agregar".
vi.mock('@/hooks/useCarrito.js', () => ({
  useCarrito: vi.fn(),
}));

const catalogo = [
  { codigo: 'MC001', nombre: 'Cemento gris 25 kg', marca: 'Polpaico', unidad: 'Saco', categoria: 'Materiales', precioVenta: 5990, stock: 80, stockMinimo: 20 },
];

function mostrar() {
  return render(
    <MemoryRouter>
      <ProductosContainer />
    </MemoryRouter>,
  );
}

describe('ProductosContainer con useCarrito simulado', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('ep1-products', JSON.stringify(catalogo));
  });

  it('llama a agregar con el código del producto', () => {
    const agregar = vi.fn(() => ({ ok: true, mensaje: 'Producto agregado al carrito.' }));
    useCarrito.mockReturnValue({ agregar });
    mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(agregar).toHaveBeenCalledWith('MC001');
    expect(screen.getByText('Producto agregado al carrito.')).toBeInTheDocument();
  });

  it('muestra el aviso de error que devuelva el carrito', () => {
    const agregar = vi.fn(() => ({ ok: false, mensaje: 'Ya agregaste todo el stock disponible.' }));
    useCarrito.mockReturnValue({ agregar });
    mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(screen.getByText('Ya agregaste todo el stock disponible.')).toBeInTheDocument();
  });
});
