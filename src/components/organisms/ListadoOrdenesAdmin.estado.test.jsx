import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListadoOrdenesAdmin from './ListadoOrdenesAdmin.jsx';

describe('ListadoOrdenesAdmin: estado (RF-17)', () => {
  it('muestra la columna Estado con el estado de cada orden', () => {
    const ordenes = [
      { id: 'PED-1700000000000', fecha: '14/11/2023', cliente: 'Ana Pérez', entrega: 'Despacho', estado: 'Pagado', total: 11980 },
    ];
    render(<MemoryRouter><ListadoOrdenesAdmin ordenes={ordenes} /></MemoryRouter>);
    expect(screen.getByRole('columnheader', { name: 'Estado' })).toBeInTheDocument();
    expect(screen.getByText('Pagado')).toBeInTheDocument();
  });
});