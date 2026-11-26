import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminOrdenesContainer from '@/containers/admin/AdminOrdenesContainer.jsx';

describe('AdminOrdenesContainer: estado (RF-17)', () => {
  it('traduce el estado que envía el backend', async () => {
    localStorage.setItem('ep1-orders', JSON.stringify([
      { id: 'PED-1', status: 'CONFIRMED', total: 1000, notes: 'Despacho', createdAt: '2026-11-01T12:00:00Z', items: [] },
      { id: 'PED-2', status: 'DELIVERED', total: 2000, notes: 'Retiro en tienda', createdAt: '2026-11-02T12:00:00Z', items: [] },
    ]));
    render(<MemoryRouter><AdminOrdenesContainer /></MemoryRouter>);
    expect(await screen.findByText('Pagado')).toBeInTheDocument();
    expect(screen.getByText('Entregado')).toBeInTheDocument();
  });
});
