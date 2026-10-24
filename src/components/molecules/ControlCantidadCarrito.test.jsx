import { render, screen, fireEvent } from '@testing-library/react';
import ControlCantidadCarrito from './ControlCantidadCarrito.jsx';

describe('ControlCantidadCarrito', () => {
  it('muestra la cantidad actual', () => {
    render(<ControlCantidadCarrito cantidad={3} tope={10} onCambiar={() => {}} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('avisa la cantidad menor y la mayor al presionar − y +', () => {
    const onCambiar = vi.fn();
    render(<ControlCantidadCarrito cantidad={3} tope={10} onCambiar={onCambiar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Quitar una unidad' }));
    fireEvent.click(screen.getByRole('button', { name: 'Agregar una unidad' }));
    expect(onCambiar).toHaveBeenNthCalledWith(1, 2);
    expect(onCambiar).toHaveBeenNthCalledWith(2, 4);
  });

  it('deshabilita + cuando se llega al tope de stock', () => {
    render(<ControlCantidadCarrito cantidad={10} tope={10} onCambiar={() => {}} />);
    expect(screen.getByRole('button', { name: 'Agregar una unidad' })).toBeDisabled();
  });
});