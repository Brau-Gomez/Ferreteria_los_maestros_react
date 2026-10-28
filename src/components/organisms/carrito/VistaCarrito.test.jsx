import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VistaCarrito from '@/components/organisms/carrito/VistaCarrito.jsx';

const items = [
  { codigo: 'MC001', nombre: 'Cemento gris 25 kg', precioVenta: 5990, stock: 80, cantidad: 2 },
];

const base = {
  items,
  total: 20000,
  aviso: null,
  onCambiarCantidad: () => {},
  onQuitar: () => {},
  onCerrarAviso: () => {},
};

function mostrar(propiedades) {
  return render(
    <MemoryRouter>
      <VistaCarrito {...base} {...propiedades} />
    </MemoryRouter>,
  );
}

describe('VistaCarrito', () => {
  it('muestra los productos y el resumen cuando hay items', () => {
    mostrar();
    expect(screen.getByText('Cemento gris 25 kg')).toBeInTheDocument();
    expect(screen.getByText('Resumen del pedido')).toBeInTheDocument();
    expect(screen.getByText('$20.000')).toBeInTheDocument();
  });

  it('muestra el estado vacío sin resumen', () => {
    mostrar({ items: [], total: 0 });
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
    expect(screen.queryByText('Resumen del pedido')).not.toBeInTheDocument();
  });

  it('muestra el aviso con su mensaje y permite cerrarlo', () => {
    const onCerrarAviso = vi.fn();
    mostrar({ aviso: { ok: false, mensaje: 'Inicia sesión antes.' }, onCerrarAviso });
    expect(screen.getByText('Inicia sesión antes.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onCerrarAviso).toHaveBeenCalledTimes(1);
  });

  it('avisa el código al quitar un producto', () => {
    const onQuitar = vi.fn();
    mostrar({ onQuitar });
    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }));
    expect(onQuitar).toHaveBeenCalledWith('MC001');
  });
});