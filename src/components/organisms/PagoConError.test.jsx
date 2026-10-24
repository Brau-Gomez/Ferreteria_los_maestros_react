import { render, screen, fireEvent } from '@testing-library/react';
import PagoConError from './PagoConError.jsx';

describe('PagoConError', () => {
  it('muestra el motivo y avisa al reintentar', () => {
    const onReintentar = vi.fn();
    render(<PagoConError mensaje="El banco rechazó la tarjeta." onReintentar={onReintentar} />);
    expect(screen.getByText('El banco rechazó la tarjeta.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Volver a realizar el pago' }));
    expect(onReintentar).toHaveBeenCalledTimes(1);
  });
});