import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListadoOrdenesAdmin from './ListadoOrdenesAdmin.jsx';

const ordenes = [
  { id: 'PED-1700000000000', fecha: '14/11/2023', cliente: 'Ana Pérez', entrega: 'Despacho', total: 11980 },
];

function mostrar(lista) {
  return render(
    <MemoryRouter>
      <ListadoOrdenesAdmin ordenes={lista} />
    </MemoryRouter>,
  );
}

describe('ListadoOrdenesAdmin', () => {
  it('muestra los datos de cada orden y el enlace a su boleta', () => {
    mostrar(ordenes);
    expect(screen.getByText('PED-1700000000000')).toBeInTheDocument();
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('$11.980')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver boleta' })).toHaveAttribute('href', '/admin/ordenes/PED-1700000000000');
  });

  it('muestra un mensaje si no hay órdenes', () => {
    mostrar([]);
    expect(screen.getByText('Todavía no hay órdenes registradas.')).toBeInTheDocument();
  });
});