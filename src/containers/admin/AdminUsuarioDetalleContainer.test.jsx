import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider.jsx';
import AdminUsuarioDetalleContainer from '@/containers/admin/AdminUsuarioDetalleContainer.jsx';

const admin = { run: '123456785', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true };
const cliente = { run: '222222222', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', tipoUsuario: 'Cliente', activo: true };
const vendedor = { run: '444444444', nombre: 'Vera', apellidos: 'Vende', correo: 'vera@duoc.cl', tipoUsuario: 'Vendedor', activo: true };
const pedidos = [
  { id: 'PED-1700000000000', runUsuario: '222222222', total: 11980, delivery: 'Despacho', productos: [] },
  { id: 'PED-1800000000000', runUsuario: '222222222', total: 5990, delivery: 'Retiro en tienda', productos: [] },
  { id: 'PED-1900000000000', runUsuario: '999999999', total: 1000, delivery: 'Despacho', productos: [] },
];

function mostrar(run, usuarios = [admin, cliente], sesionRun = admin.run) {
  localStorage.clear();
  localStorage.setItem('ep1-users', JSON.stringify(usuarios));
  localStorage.setItem('ep1-orders', JSON.stringify(pedidos));
  localStorage.setItem('ep1-user', JSON.stringify({ run: sesionRun }));
  return render(
    <MemoryRouter initialEntries={['/admin/usuarios/' + run]}>
      <AuthProvider>
        <Routes>
          <Route path="/admin/usuarios" element={<p>Listado de usuarios</p>} />
          <Route path="/admin/usuarios/:run" element={<AdminUsuarioDetalleContainer />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('AdminUsuarioDetalleContainer', () => {
  afterEach(() => vi.restoreAllMocks());

  it('muestra solo las compras del usuario y su total', () => {
    mostrar('222222222');
    expect(screen.getByText('PED-1700000000000')).toBeInTheDocument();
    expect(screen.getByText('PED-1800000000000')).toBeInTheDocument();
    expect(screen.queryByText('PED-1900000000000')).not.toBeInTheDocument();
    expect(screen.getByText('$17.970')).toBeInTheDocument();
  });

  it('acepta el RUN con puntos y guion en la URL', () => {
    mostrar('22.222.222-2');
    expect(screen.getByRole('heading', { level: 1, name: 'Ana Pérez' })).toBeInTheDocument();
  });

  it('avisa si el usuario no existe', () => {
    mostrar('000000000');
    expect(screen.getByText('Usuario no encontrado')).toBeInTheDocument();
  });

  it('no permite eliminar el perfil con el que se inició sesión', () => {
    mostrar('123456785');
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar usuario' }));
    expect(screen.getByRole('alert')).toHaveTextContent('No puedes eliminar el perfil con el que tienes iniciada la sesión.');
  });

  it('no permite eliminar al último administrador', () => {
    mostrar('123456785', [admin, vendedor], vendedor.run);
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar usuario' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Debe existir al menos un perfil Administrador.');
  });

  it('elimina el usuario tras confirmar y vuelve al listado', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mostrar('222222222');
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar usuario' }));
    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Listado de usuarios')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-users')).map((u) => u.run)).toEqual(['123456785']);
  });

  it('si se cancela la confirmación no elimina nada', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    mostrar('222222222');
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar usuario' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Ana Pérez' })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-users'))).toHaveLength(2);
  });
});