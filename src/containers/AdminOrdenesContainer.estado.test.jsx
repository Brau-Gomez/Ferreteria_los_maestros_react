import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminOrdenesContainer from './AdminOrdenesContainer.jsx';

describe('AdminOrdenesContainer: estado (RF-17)', () => {
  it('usa "Pagado" por defecto y respeta un estado propio', () => {
    localStorage.clear();
    localStorage.setItem('ep1-orders', JSON.stringify([
      { id: 'PED-1700000000000', runUsuario: '1', total: 1000, delivery: 'Despacho', productos: [] },
      { id: 'PED-1800000000000', runUsuario: '1', total: 2000, delivery: 'Retiro en tienda', estado: 'Entregado', productos: [] },
    ]));
    render(<MemoryRouter><AdminOrdenesContainer /></MemoryRouter>);
    expect(screen.getByText('Pagado')).toBeInTheDocument();
    expect(screen.getByText('Entregado')).toBeInTheDocument();
  });
});