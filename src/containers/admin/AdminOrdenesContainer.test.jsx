import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminOrdenesContainer from '@/containers/admin/AdminOrdenesContainer.jsx';

const usuarios = [{ run: '123456785', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', tipoUsuario: 'Cliente', activo: true }];
// Órdenes tal como las devuelve order-service: el cliente viaja por correo.
const ordenes = [
  { id: 'PED-A', customerEmail: 'ana@gmail.com', total: 5990, notes: 'Retiro en tienda', createdAt: '2026-11-01T12:00:00Z', items: [] },
  { id: 'PED-B', customerEmail: 'otro@gmail.com', total: 11980, notes: 'Despacho', createdAt: '2026-11-02T12:00:00Z', items: [] },
];

function mostrar(lista) {
  localStorage.setItem('ep1-users', JSON.stringify(usuarios));
  if (lista) localStorage.setItem('ep1-orders', JSON.stringify(lista));
  render(
    <MemoryRouter>
      <AdminOrdenesContainer />
    </MemoryRouter>,
  );
}

describe('AdminOrdenesContainer', () => {
  it('lista las órdenes con la más reciente primero y el cliente resuelto por correo', async () => {
    mostrar(ordenes);
    expect(await screen.findByText('Ana Pérez')).toBeInTheDocument();
    const filas = screen.getAllByRole('row');
    expect(filas[1]).toHaveTextContent('PED-B');
    expect(filas[2]).toHaveTextContent('PED-A');
    expect(screen.getByText('Cliente no registrado (otro@gmail.com)')).toBeInTheDocument();
  });

  it('muestra el estado vacío sin órdenes', async () => {
    mostrar();
    expect(await screen.findByText('Todavía no hay órdenes registradas.')).toBeInTheDocument();
  });
});
