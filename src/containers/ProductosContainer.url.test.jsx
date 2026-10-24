import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartProvider.jsx';
import ProductosContainer from './ProductosContainer.jsx';

const catalogo = [
  { codigo: 'H1', nombre: 'Martillo carpintero', marca: 'Stanley', unidad: 'U', categoria: 'Herramientas', precioVenta: 8990, stock: 10, stockMinimo: 3 },
  { codigo: 'M1', nombre: 'Tabla de pino', marca: 'X', unidad: 'U', categoria: 'Madera', precioVenta: 1000, stock: 10, stockMinimo: 3 },
];

function mostrar(ruta, propiedades) {
  localStorage.clear();
  localStorage.setItem('ep1-products', JSON.stringify(catalogo));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <CartProvider>
        <ProductosContainer {...propiedades} />
      </CartProvider>
    </MemoryRouter>,
  );
}

describe('ProductosContainer: búsqueda por URL y categoría inicial', () => {
  it('aplica el texto de ?q= como filtro', () => {
    mostrar('/productos?q=martillo');
    expect(screen.getByLabelText('Buscar por nombre, marca o código')).toHaveValue('martillo');
    expect(screen.getByText('Martillo carpintero')).toBeInTheDocument();
    expect(screen.queryByText('Tabla de pino')).not.toBeInTheDocument();
  });

  it('usa la categoría inicial recibida', () => {
    mostrar('/categorias/Madera', { categoriaInicial: 'Madera' });
    expect(screen.getByLabelText('Categoría')).toHaveValue('Madera');
    expect(screen.queryByText('Martillo carpintero')).not.toBeInTheDocument();
  });
});