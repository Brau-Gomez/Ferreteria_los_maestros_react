import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HeroPortada from '@/components/organisms/tienda/HeroPortada.jsx';

describe('HeroPortada', () => {
  it('muestra el título y el botón al catálogo', () => {
    render(<MemoryRouter><HeroPortada /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: 'Ferretería Los Maestros' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ver catálogo' })).toHaveAttribute('href', '/productos');
  });
});