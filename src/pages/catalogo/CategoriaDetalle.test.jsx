import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CategoriaDetalle from '@/pages/catalogo/CategoriaDetalle.jsx';

const catalogo = [
  { codigo: 'M1', categoria: 'Madera', nombre: 'Tabla de pino', marca: 'X', unidad: 'U', precioVenta: 1000, stock: 5, stockMinimo: 1 },
  { codigo: 'J1', categoria: 'Jardín', nombre: 'Pala de jardín', marca: 'X', unidad: 'U', precioVenta: 3000, stock: 5, stockMinimo: 1 },
];

function mostrar(ruta) {
  localStorage.setItem('ep1-products', JSON.stringify(catalogo));
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/categorias/:categoria" element={<CategoriaDetalle />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('CategoriaDetalle', () => {
  it('muestra solo los productos de la categoría de la URL', async () => {
    mostrar('/categorias/Madera');
    expect(await screen.findByRole('heading', { level: 1, name: 'Madera' })).toBeInTheDocument();
    expect(await screen.findByText('Tabla de pino')).toBeInTheDocument();
    expect(screen.queryByText('Pala de jardín')).not.toBeInTheDocument();
  });

  it('decodifica categorías con tilde en la URL', async () => {
    mostrar('/categorias/' + encodeURIComponent('Jardín'));
    expect(await screen.findByText('Pala de jardín')).toBeInTheDocument();
  });

  it('avisa cuando la categoría no existe', async () => {
    mostrar('/categorias/Inventada');
    expect(await screen.findByText('Categoría no encontrada')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver todas las categorías' })).toHaveAttribute('href', '/categorias');
  });
});
