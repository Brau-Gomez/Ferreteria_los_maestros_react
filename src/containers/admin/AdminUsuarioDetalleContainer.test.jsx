import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminUsuarioDetalleContainer from '@/containers/admin/AdminUsuarioDetalleContainer.jsx';

const admin = { run: '123456785', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true };
const cliente = { run: '222222222', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', tipoUsuario: 'Cliente', activo: true };
const vendedor = { run: '444444444', nombre: 'Vera', apellidos: 'Vende', correo: 'vera@duoc.cl', tipoUsuario: 'Vendedor', activo: true };
// La API guarda el correo de quien compró (customerEmail).
const pedidos = [
  { id: 'PED-1', customerEmail: 'ana@gmail.com', total: 11980, notes: 'Despacho', createdAt: '2026-11-01T12:00:00Z', items: [] },
  { id: 'PED-2', customerEmail: 'ana@gmail.com', total: 5990, notes: 'Retiro en tienda', createdAt: '2026-11-02T12:00:00Z', items: [] },
  { id: 'PED-3', customerEmail: 'otro@gmail.com', total: 1000, notes: 'Despacho', createdAt: '2026-11-03T12:00:00Z', items: [] },
];

async function mostrar(run, { usuarios = [admin, cliente], sesion = admin, esperar = 'detalle' } = {}) {
  localStorage.setItem('ep1-users', JSON.stringify(usuarios));
  localStorage.setItem('ep1-orders', JSON.stringify(pedidos));
  localStorage.setItem('ep1-user', JSON.stringify(sesion));
  render(
    <MemoryRouter initialEntries={['/admin/usuarios/' + run]}>
      <Routes>
        <Route path="/admin/usuarios" element={<p>Listado de usuarios</p>} />
        <Route path="/admin/usuarios/:run" element={<AdminUsuarioDetalleContainer />} />
      </Routes>
    </MemoryRouter>,
  );
  if (esperar === 'detalle') await screen.findByRole('button', { name: 'Eliminar usuario' });
}

const runsGuardados = () => JSON.parse(localStorage.getItem('ep1-users')).map((u) => u.run);

describe('AdminUsuarioDetalleContainer', () => {
  afterEach(() => vi.restoreAllMocks());

  it('muestra solo las compras del usuario y su total', async () => {
    await mostrar('222222222');
    expect(screen.getByText('PED-1')).toBeInTheDocument();
    expect(screen.getByText('PED-2')).toBeInTheDocument();
    expect(screen.queryByText('PED-3')).not.toBeInTheDocument();
    expect(screen.getByText('$17.970')).toBeInTheDocument();
  });

  it('acepta el RUN con puntos y guion en la URL', async () => {
    await mostrar('22.222.222-2');
    expect(screen.getByRole('heading', { level: 1, name: 'Ana Pérez' })).toBeInTheDocument();
  });

  it('avisa si el usuario no existe', async () => {
    await mostrar('000000000', { esperar: 'nada' });
    expect(await screen.findByText('Usuario no encontrado')).toBeInTheDocument();
  });

  it('no permite eliminar el perfil con el que se inició sesión', async () => {
    await mostrar('123456785');
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar usuario' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No puedes eliminar el perfil con el que tienes iniciada la sesión.');
    expect(runsGuardados()).toEqual(['123456785', '222222222']);
  });

  it('no permite eliminar al último administrador', async () => {
    await mostrar('123456785', { usuarios: [admin, vendedor], sesion: vendedor });
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar usuario' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Debe existir al menos un perfil Administrador.');
  });

  it('elimina el usuario tras confirmar y vuelve al listado', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    await mostrar('222222222');
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar usuario' }));
    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('Listado de usuarios')).toBeInTheDocument();
    expect(runsGuardados()).toEqual(['123456785']);
  });

  it('si se cancela la confirmación no elimina nada', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    await mostrar('222222222');
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar usuario' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Ana Pérez' })).toBeInTheDocument();
    expect(runsGuardados()).toHaveLength(2);
  });
});
