import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartProvider.jsx';
import OfertasContainer from './OfertasContainer.jsx';

const catalogo = [
  { codigo: 'A1', categoria: 'Madera', nombre: 'Tabla en oferta', marca: 'X', unidad: 'U', precioVenta: 800, precioAnterior: 1000, enOferta: true, stock: 5, stockMinimo: 1 },
  { codigo: 'B1', categoria: 'Madera', nombre: 'Viga normal', marca: 'X', unidad: 'U', precioVenta: 2000, stock: 5, stockMinimo: 1 },
];

function mostrar(productos) {
  localStorage.clear();
  localStorage.setItem('ep1-products', JSON.stringify(productos));
  return render(
    <MemoryRouter>
      <CartProvider>
        <OfertasContainer />
      </CartProvider>
    </MemoryRouter>,
  );
}

describe('OfertasContainer', () => {
  it('muestra solo los productos en oferta', () => {
    mostrar(catalogo);
    expect(screen.getByText('Tabla en oferta')).toBeInTheDocument();
    expect(screen.queryByText('Viga normal')).not.toBeInTheDocument();
  });

  it('agrega al carrito y muestra el aviso', () => {
    mostrar(catalogo);
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(JSON.parse(localStorage.getItem('ep1-cart'))).toHaveLength(1);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('muestra un mensaje si no hay ofertas', () => {
    mostrar([catalogo[1]]);
    expect(screen.getByText('No hay ofertas por ahora')).toBeInTheDocument();
  });
});