import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PanelCarrito from './PanelCarrito.jsx';
import { useCarrito } from '../../hooks/useCarrito.js';

// Mock del hook del carrito: se controla el estado del panel y se verifica
// qué funciones del contexto llama cada botón.
vi.mock('../../hooks/useCarrito.js', () => ({
  useCarrito: vi.fn(),
}));

const item = { codigo: 'MC001', nombre: 'Cemento gris 25 kg', precioVenta: 5990, stock: 10, cantidad: 2 };

function estado(cambios = {}) {
  return {
    items: [item],
    total: 11980,
    panelAbierto: true,
    cerrarPanel: vi.fn(),
    cambiarCantidad: vi.fn(),
    quitar: vi.fn(),
    vaciar: vi.fn(),
    ...cambios,
  };
}

function mostrar(cambios) {
  const contexto = estado(cambios);
  useCarrito.mockReturnValue(contexto);
  render(
    <MemoryRouter>
      <PanelCarrito />
    </MemoryRouter>,
  );
  return contexto;
}

describe('PanelCarrito', () => {
  beforeAll(() => {
    // jsdom no implementa matchMedia, que usa el Offcanvas de react-bootstrap:
    // se reemplaza por un mock que responde "sin coincidencia".
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    }));
  });

  it('muestra un mensaje cuando el carrito está vacío', () => {
    mostrar({ items: [], total: 0 });
    expect(screen.getByText('Todavía no agregas productos.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Vaciar carrito' })).not.toBeInTheDocument();
  });

  it('muestra los productos, el subtotal y el total', () => {
    mostrar();
    expect(screen.getByText('Cemento gris 25 kg')).toBeInTheDocument();
    expect(screen.getByText(/Subtotal:/)).toHaveTextContent('$11.980');
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('llama a quitar con el código del producto', () => {
    const contexto = mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(contexto.quitar).toHaveBeenCalledWith('MC001');
  });

  it('llama a cambiarCantidad al usar los controles + y −', () => {
    const contexto = mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Agregar una unidad' }));
    fireEvent.click(screen.getByRole('button', { name: 'Quitar una unidad' }));
    expect(contexto.cambiarCantidad).toHaveBeenNthCalledWith(1, 'MC001', 3);
    expect(contexto.cambiarCantidad).toHaveBeenNthCalledWith(2, 'MC001', 1);
  });

  it('llama a vaciar y a cerrarPanel con sus botones', () => {
    const contexto = mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Vaciar carrito' }));
    fireEvent.click(screen.getByRole('button', { name: 'Seguir comprando' }));
    expect(contexto.vaciar).toHaveBeenCalledTimes(1);
    expect(contexto.cerrarPanel).toHaveBeenCalledTimes(1);
  });
});