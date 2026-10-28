import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PagoCorrecto from '@/components/organisms/checkout/PagoCorrecto.jsx';

describe('PagoCorrecto', () => {
  it('muestra número de pedido, total, entrega y correo', () => {
    render(
      <MemoryRouter>
        <PagoCorrecto pedido={{ id: 'PED-123', total: 11980, entrega: 'Despacho', correo: 'ana@gmail.com' }} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Pedido PED-123')).toBeInTheDocument();
    expect(screen.getByText('$11.980')).toBeInTheDocument();
    expect(screen.getByText(/Entrega: Despacho/)).toBeInTheDocument();
    expect(screen.getByText(/ana@gmail.com/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver mis pedidos' })).toHaveAttribute('href', '/cuenta');
  });
});