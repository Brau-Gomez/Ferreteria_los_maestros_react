import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from '../context/CartProvider.jsx';
import CategoriaDetalle from './CategoriaDetalle.jsx';

const catalogo = [
  { codigo: 'M1', categoria: 'Madera', nombre: 'Tabla de pino', marca: 'X', unidad: 'U', precioVenta: 1000, stock: 5, stockMinimo: 1 },
  { codigo: 'J1', categoria: 'Jardín', nombre: 'Pala de jardín', marca: 'X', unidad: 'U', precioVenta: 3000, stock: 5, stockMinimo: 1 },
];

function mostrar(ruta) {
  localStorage.clear();
  localStorage.setItem('ep1-products', JSON.stringify(catalogo));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <CartProvider>
        <Routes>
          <Route path="/categorias/:categoria" element={<CategoriaDetalle />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>,
  );
}

describe('CategoriaDetalle', () => {
  it('muestra solo los productos de la categoría de la URL', () => {
    mostrar('/categorias/Madera');
    expect(screen.getByRole('heading', { level: 1, name: 'Madera' })).toBeInTheDocument();
    expect(screen.getByText('Tabla de pino')).toBeInTheDocument();
    expect(screen.queryByText('Pala de jardín')).not.toBeInTheDocument();
  });

  it('decodifica categorías con tilde en la URL', () => {
    mostrar('/categorias/' + encodeURIComponent('Jardín'));
    expect(screen.getByText('Pala de jardín')).toBeInTheDocument();
  });

  it('avisa cuando la categoría no existe', () => {
    mostrar('/categorias/Inventada');
    expect(screen.getByText('Categoría no encontrada')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver todas las categorías' })).toHaveAttribute('href', '/categorias');
  });
});