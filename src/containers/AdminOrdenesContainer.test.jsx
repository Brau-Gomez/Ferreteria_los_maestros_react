import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminOrdenesContainer from './AdminOrdenesContainer.jsx';

const usuarios = [{ run: '123456785', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', tipoUsuario: 'Cliente', activo: true }];
const pedidos = [
  { id: 'PED-1700000000000', runUsuario: '123456785', total: 5990, delivery: 'Retiro en tienda', productos: [] },
  { id: 'PED-1800000000000', runUsuario: '999999999', total: 11980, delivery: 'Despacho', productos: [] },
];

function mostrar(listaPedidos) {
  localStorage.clear();
  localStorage.setItem('ep1-users', JSON.stringify(usuarios));
  if (listaPedidos) localStorage.setItem('ep1-orders', JSON.stringify(listaPedidos));
  return render(
    <MemoryRouter>
      <AdminOrdenesContainer />
    </MemoryRouter>,
  );
}

describe('AdminOrdenesContainer', () => {
  it('lista las órdenes con la más reciente primero y el cliente resuelto', () => {
    mostrar(pedidos);
    const filas = screen.getAllByRole('row');
    expect(filas[1]).toHaveTextContent('PED-1800000000000');
    expect(filas[2]).toHaveTextContent('PED-1700000000000');
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('Cliente no registrado (999999999)')).toBeInTheDocument();
  });

  it('muestra el estado vacío sin pedidos guardados', () => {
    mostrar();
    expect(screen.getByText('Todavía no hay órdenes registradas.')).toBeInTheDocument();
  });
});