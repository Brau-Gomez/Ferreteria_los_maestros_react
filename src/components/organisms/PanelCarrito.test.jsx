import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PanelCarrito from './PanelCarrito.jsx';

const item = { codigo: 'MC001', nombre: 'Cemento gris', precioVenta: 5990, stock: 10, cantidad: 2 };

function mostrar(props = {}) {
  const acciones = { onCerrar: vi.fn(), onCambiarCantidad: vi.fn(), onQuitar: vi.fn(), onVaciar: vi.fn() };
  render(
    <MemoryRouter>
      <PanelCarrito items={[item]} total={11980} abierto {...acciones} {...props} />
    </MemoryRouter>,
  );
  return acciones;
}

describe('PanelCarrito (presentacional)', () => {
  beforeAll(() => {
    window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
  });
  it('muestra el producto, su subtotal y el total', () => {
    mostrar();
    expect(screen.getByText('Cemento gris')).toBeInTheDocument();
    expect(screen.getByText(/Subtotal:/)).toHaveTextContent('$11.980');
  });
  it('informa si el carrito está vacío', () => {
    mostrar({ items: [], total: 0 });
    expect(screen.getByText('Todavía no agregas productos.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Vaciar carrito' })).not.toBeInTheDocument();
  });
  it('Eliminar y Vaciar llaman a sus acciones', () => {
    const a = mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(a.onQuitar).toHaveBeenCalledWith('MC001');
    fireEvent.click(screen.getByRole('button', { name: 'Vaciar carrito' }));
    expect(a.onVaciar).toHaveBeenCalledTimes(1);
  });
  it('Seguir comprando e Ir al carrito cierran el panel', () => {
    const a = mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Seguir comprando' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ir al carrito' }));
    expect(a.onCerrar).toHaveBeenCalledTimes(2);
  });
});