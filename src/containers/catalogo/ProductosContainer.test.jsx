import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '@/context/CartProvider.jsx';
import ProductosContainer from '@/containers/catalogo/ProductosContainer.jsx';

const catalogo = [
  { codigo: 'MC001', nombre: 'Cemento gris 25 kg', marca: 'Polpaico', unidad: 'Saco', categoria: 'Materiales', precioVenta: 5990, stock: 80, stockMinimo: 20 },
  { codigo: 'HE001', nombre: 'Taladro percutor', marca: 'Bosch', unidad: 'Unidad', categoria: 'Herramientas', precioVenta: 39990, stock: 0, stockMinimo: 2 },
  { codigo: 'HE002', nombre: 'Martillo carpintero', marca: 'Stanley', unidad: 'Unidad', categoria: 'Herramientas', precioVenta: 8990, stock: 10, stockMinimo: 3 },
];

function mostrar() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <ProductosContainer />
      </CartProvider>
    </MemoryRouter>,
  );
}

describe('ProductosContainer', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('ep1-products', JSON.stringify(catalogo));
  });

  it('muestra todos los productos del catálogo al inicio', () => {
    mostrar();
    expect(screen.getByText(/3 productos/)).toBeInTheDocument();
    expect(screen.getByText('Cemento gris 25 kg')).toBeInTheDocument();
  });

  it('filtra por el texto de búsqueda', () => {
    mostrar();
    fireEvent.change(screen.getByLabelText('Buscar por nombre, marca o código'), {
      target: { value: 'martillo' },
    });
    expect(screen.getByText(/1 productos/)).toBeInTheDocument();
    expect(screen.getByText('Martillo carpintero')).toBeInTheDocument();
    expect(screen.queryByText('Cemento gris 25 kg')).not.toBeInTheDocument();
  });

  it('filtra por categoría y por "Sólo con stock"', () => {
    mostrar();
    fireEvent.change(screen.getByLabelText('Categoría'), {
      target: { value: 'Herramientas' },
    });
    expect(screen.getByText(/2 productos/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Sólo con stock'));
    expect(screen.getByText(/1 productos/)).toBeInTheDocument();
    expect(screen.getByText('Martillo carpintero')).toBeInTheDocument();
  });

  it('muestra "Sin resultados" si nada coincide', () => {
    mostrar();
    fireEvent.change(screen.getByLabelText('Buscar por nombre, marca o código'), {
      target: { value: 'zzz' },
    });
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('avisa que el producto fue agregado al carrito', () => {
    mostrar();
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar' })[0]);
    expect(screen.getByText('Producto agregado al carrito.')).toBeInTheDocument();
  });
});