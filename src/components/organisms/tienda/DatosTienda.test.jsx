import { render, screen } from '@testing-library/react';
import DatosTienda from '@/components/organisms/tienda/DatosTienda.jsx';

describe('DatosTienda', () => {
  it('muestra horario, dirección, teléfono y correo', () => {
    render(<DatosTienda />);
    expect(screen.getByText('Horario de atención')).toBeInTheDocument();
    expect(screen.getByText('Av. Francisco de Aguirre 1234')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '+56 51 234 5678' })).toHaveAttribute('href', 'tel:+56512345678');
    expect(screen.getByRole('link', { name: 'contacto@losmaestros.cl' })).toHaveAttribute(
      'href',
      'mailto:contacto@losmaestros.cl',
    );
  });
});