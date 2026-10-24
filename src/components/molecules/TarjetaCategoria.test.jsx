import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TarjetaCategoria from './TarjetaCategoria.jsx';

function mostrar(cantidad) {
  return render(
    <MemoryRouter>
      <TarjetaCategoria categoria="Mat. Construcción" cantidad={cantidad} />
    </MemoryRouter>,
  );
}

describe('TarjetaCategoria', () => {
  it('muestra la cantidad en plural y enlaza a la categoría codificada', () => {
    mostrar(10);
    expect(screen.getByText('10 productos')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/categorias/Mat.%20Construcci%C3%B3n');
  });

  it('usa singular con un solo producto', () => {
    mostrar(1);
    expect(screen.getByText('1 producto')).toBeInTheDocument();
  });
});