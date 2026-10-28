import { render, screen } from '@testing-library/react';
import Footer from '@/components/organisms/tienda/Footer.jsx';

describe('Footer', () => {
  it('muestra el nombre, la ciudad y el horario de la ferretería', () => {
    render(<Footer />);
    expect(screen.getByText('Ferretería Los Maestros')).toBeInTheDocument();
    expect(screen.getByText('La Serena, Región de Coquimbo')).toBeInTheDocument();
    expect(screen.getByText(/Lun a Vie/)).toBeInTheDocument();
  });
});