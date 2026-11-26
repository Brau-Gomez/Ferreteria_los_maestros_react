import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductosContainer from '@/containers/catalogo/ProductosContainer.jsx';

const catalogo = [
  { codigo: 'MC001', nombre: 'Cemento gris 25 kg', marca: 'Polpaico', unidad: 'Saco', categoria: 'Materiales', precioVenta: 5990, stock: 80, stockMinimo: 20 },
  { codigo: 'HE001', nombre: 'Taladro percutor', marca: 'Bosch', unidad: 'Unidad', categoria: 'Herramientas', precioVenta: 39990, stock: 0, stockMinimo: 2 },
  { codigo: 'HE002', nombre: 'Martillo carpintero', marca: 'Stanley', unidad: 'Unidad', categoria: 'Herramientas', precioVenta: 8990, stock: 10, stockMinimo: 3 },
];

// Espera a que el catálogo llegue desde la API antes de interactuar.
async function mostrar() {
  render(
    <MemoryRouter>
      <ProductosContainer />
    </MemoryRouter>,
  );
  await screen.findByText('Cemento gris 25 kg');
}

describe('ProductosContainer', () => {
  beforeEach(() => {
    localStorage.setItem('ep1-products', JSON.stringify(catalogo));
    // El carrito exige sesión iniciada.
    localStorage.setItem('ep1-user', JSON.stringify({ run: '222222222', nombre: 'Ana', apellidos: 'Demo', correo: 'cliente@gmail.com', tipoUsuario: 'Cliente', activo: true }));
  });

  it('muestra todos los productos del catálogo al inicio', async () => {
    await mostrar();
    expect(screen.getByText(/3 productos/)).toBeInTheDocument();
    expect(screen.getByText('Cemento gris 25 kg')).toBeInTheDocument();
  });

  it('filtra por el texto de búsqueda', async () => {
    await mostrar();
    fireEvent.change(screen.getByLabelText('Buscar por nombre, marca o código'), {
      target: { value: 'martillo' },
    });
    expect(screen.getByText(/1 productos/)).toBeInTheDocument();
    expect(screen.getByText('Martillo carpintero')).toBeInTheDocument();
    expect(screen.queryByText('Cemento gris 25 kg')).not.toBeInTheDocument();
  });

  it('filtra por categoría y por "Sólo con stock"', async () => {
    await mostrar();
    fireEvent.change(screen.getByLabelText('Categoría'), {
      target: { value: 'Herramientas' },
    });
    expect(screen.getByText(/2 productos/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Sólo con stock'));
    expect(screen.getByText(/1 productos/)).toBeInTheDocument();
    expect(screen.getByText('Martillo carpintero')).toBeInTheDocument();
  });

  it('muestra "Sin resultados" si nada coincide', async () => {
    await mostrar();
    fireEvent.change(screen.getByLabelText('Buscar por nombre, marca o código'), {
      target: { value: 'zzz' },
    });
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('avisa que el producto fue agregado al carrito', async () => {
    await mostrar();
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar' })[0]);
    expect(await screen.findByText('Producto agregado al carrito.')).toBeInTheDocument();
  });

  it('pide iniciar sesión si un visitante intenta agregar al carrito', async () => {
    localStorage.removeItem('ep1-user');
    await mostrar();
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar' })[0]);
    expect(await screen.findByText('Inicia sesión para agregar productos al carrito.')).toBeInTheDocument();
  });
});