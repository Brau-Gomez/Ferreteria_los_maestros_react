import { render, screen, fireEvent } from '@testing-library/react';
import ResumenPedido from './ResumenPedido.jsx';

const base = {
  total: 15980,
  entrega: 'Retiro en tienda',
  onCambiarEntrega: () => {},
  onConfirmar: (evento) => evento.preventDefault(),
};

describe('ResumenPedido', () => {
  it('muestra el total formateado y las dos opciones de entrega', () => {
    render(<ResumenPedido {...base} />);
    expect(screen.getByText('$15.980')).toBeInTheDocument();
    expect(screen.getByLabelText('Retiro en tienda')).toBeChecked();
    expect(screen.getByLabelText('Despacho')).not.toBeChecked();
  });

  it('avisa la entrega elegida', () => {
    const onCambiarEntrega = vi.fn();
    render(<ResumenPedido {...base} onCambiarEntrega={onCambiarEntrega} />);
    fireEvent.click(screen.getByLabelText('Despacho'));
    expect(onCambiarEntrega).toHaveBeenCalledWith('Despacho');
  });

  it('llama a onConfirmar al enviar el formulario', () => {
    const onConfirmar = vi.fn((evento) => evento.preventDefault());
    render(<ResumenPedido {...base} onConfirmar={onConfirmar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
    expect(onConfirmar).toHaveBeenCalledTimes(1);
  });
});