import { render, screen } from '@testing-library/react';
import SeccionNosotros from '@/components/organisms/tienda/SeccionNosotros.jsx';

describe('SeccionNosotros', () => {
  it('es la sección ancla #nosotros con su foto', () => {
    const { container } = render(<SeccionNosotros />);
    expect(container.querySelector('#nosotros')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /22 años/ })).toBeInTheDocument();
    expect(screen.getByAltText('Fachada de Ferretería Los Maestros')).toBeInTheDocument();
  });
});