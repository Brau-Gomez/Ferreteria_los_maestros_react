import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider.jsx';
import CuentaContainer from './CuentaContainer.jsx';

const cliente = {
  run: '11111111-1', nombre: 'Ana', apellidos: 'Pérez', correo: 'cliente@gmail.com',
  tipoUsuario: 'Cliente', activo: true, direccion: 'Calle 123',
};
const contratista = {
  ...cliente,
  esContratista: true,
  empresa: { razonSocial: 'Constructora Sur', rut: '761234567', direccion: 'Av. Norte 45' },
};
const admin = {
  run: '22222222-2', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl',
  tipoUsuario: 'Administrador', activo: true,
};
const pedido = {
  id: 'PED-1700000000000', runUsuario: '11111111-1', delivery: 'Despacho', total: 11980,
  productos: [{ codigo: 'MC001', nombre: 'Cemento gris 25 kg', cantidad: 2, precioVenta: 5990 }],
};
const pedidoAjeno = { ...pedido, id: 'PED-1700000000001', runUsuario: '99999999-9' };

function mostrar({ usuarios, sesion, pedidos = [] }) {
  localStorage.clear();
  localStorage.setItem('ep1-users', JSON.stringify(usuarios));
  localStorage.setItem('ep1-orders', JSON.stringify(pedidos));
  if (sesion) localStorage.setItem('ep1-user', JSON.stringify({ run: sesion }));
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CuentaContainer />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('CuentaContainer', () => {
  it('no muestra nada si no hay sesión', () => {
    mostrar({ usuarios: [cliente] });
    expect(screen.queryByText('Mi cuenta')).not.toBeInTheDocument();
  });

  it('muestra solo los pedidos del cliente con sesión', () => {
    mostrar({ usuarios: [cliente], sesion: cliente.run, pedidos: [pedido, pedidoAjeno] });
    expect(screen.getByText('PED-1700000000000')).toBeInTheDocument();
    expect(screen.queryByText('PED-1700000000001')).not.toBeInTheDocument();
  });

  it('muestra al contratista su cuenta corriente con la compra como cargo', () => {
    mostrar({ usuarios: [contratista], sesion: cliente.run, pedidos: [pedido] });
    expect(screen.getByText('Cuenta corriente')).toBeInTheDocument();
    expect(screen.getByText('Con saldo pendiente')).toBeInTheDocument();
    expect(screen.getByText('Compra en tienda')).toBeInTheDocument();
  });

  it('muestra al administrador el acceso al panel', () => {
    mostrar({ usuarios: [admin], sesion: admin.run });
    expect(screen.getByText('Acceso de administrador')).toBeInTheDocument();
  });
});