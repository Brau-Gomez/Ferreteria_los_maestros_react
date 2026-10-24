import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResumenPedido from './ResumenPedido.jsx';

describe('ResumenPedido', () => {
  it('muestra el total formateado', () => {
    render(
      <MemoryRouter>
        <ResumenPedido total={15980} />
      </MemoryRouter>,
    );
    expect(screen.getByText('$15.980')).toBeInTheDocument();
  });

  it('enlaza al checkout con el botón "Ir a pagar"', () => {
    render(
      <MemoryRouter>
        <ResumenPedido total={15980} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Ir a pagar' })).toHaveAttribute('href', '/checkout');
  });
});