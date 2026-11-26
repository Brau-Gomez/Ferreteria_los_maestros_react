import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CategoriasContainer from '@/containers/catalogo/CategoriasContainer.jsx';
import { categoriasProducto } from '@/data/categorias.js';

beforeEach(() => {
  // El backend entrega las 9 categorías oficiales.
  localStorage.setItem('ep1-categories', JSON.stringify(categoriasProducto));
  localStorage.setItem('ep1-products', JSON.stringify([
    { codigo: 'M1', categoria: 'Madera', nombre: 'Tabla', precioVenta: 1000, stock: 5, stockMinimo: 1 },
    { codigo: 'M2', categoria: 'Madera', nombre: 'Viga', precioVenta: 2000, stock: 5, stockMinimo: 1 },
    { codigo: 'J1', categoria: 'Jardín', nombre: 'Pala', precioVenta: 3000, stock: 5, stockMinimo: 1 },
  ]));
});

describe('CategoriasContainer', () => {
  it('lista las 9 categorías oficiales con su cantidad de productos', async () => {
    render(
      <MemoryRouter>
        <CategoriasContainer />
      </MemoryRouter>,
    );
    expect(await screen.findAllByRole('heading', { level: 2 })).toHaveLength(9);
    expect(await screen.findByText('2 productos')).toBeInTheDocument();
    expect(screen.getByText('1 producto')).toBeInTheDocument();
    expect(screen.getAllByText('0 productos')).toHaveLength(7);
  });
});