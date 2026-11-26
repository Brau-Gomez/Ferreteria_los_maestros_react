import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminUsuarioFormContainer from '@/containers/admin/AdminUsuarioFormContainer.jsx';
import { fallarSiguientePeticion } from '@/test/servidorFalso.js';

const admin = { run: '123456785', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', fechaNacimiento: '', tipoUsuario: 'Administrador', region: 'Región de Coquimbo', comuna: 'La Serena', direccion: 'Calle 1', activo: true };
const cliente = { run: '111111111', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', fechaNacimiento: '', tipoUsuario: 'Cliente', region: 'Región de Coquimbo', comuna: 'La Serena', direccion: 'Calle 2', activo: true };

// Prepara el backend falso y espera a que el formulario tenga regiones y comunas.
async function mostrar(ruta, { esperarFormulario = true } = {}) {
  localStorage.setItem('ep1-users', JSON.stringify([admin, cliente]));
  localStorage.setItem('ep1-user', JSON.stringify(admin));
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/usuarios/nuevo" element={<AdminUsuarioFormContainer modo="nuevo" />} />
        <Route path="/admin/usuarios/:run/editar" element={<AdminUsuarioFormContainer modo="editar" />} />
        <Route path="/admin/usuarios/:run" element={<p>Detalle del usuario</p>} />
      </Routes>
    </MemoryRouter>,
  );
  if (esperarFormulario) await screen.findByRole('option', { name: 'Coquimbo' });
}

function llenarNuevo(run = '222222222') {
  fireEvent.change(screen.getByLabelText('RUN *'), { target: { value: run } });
  fireEvent.change(screen.getByLabelText('Tipo de usuario *'), { target: { value: 'Vendedor' } });
  fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Vera' } });
  fireEvent.change(screen.getByLabelText('Apellidos *'), { target: { value: 'Vende' } });
  fireEvent.change(screen.getByLabelText('Correo *'), { target: { value: 'VERA@duoc.cl ' } });
  fireEvent.change(screen.getByLabelText('Comuna'), { target: { value: 'Coquimbo' } });
  fireEvent.change(screen.getByLabelText('Dirección'), { target: { value: 'Av. Principal 123' } });
}

const usuariosGuardados = () => JSON.parse(localStorage.getItem('ep1-users'));

describe('AdminUsuarioFormContainer', () => {
  afterEach(() => vi.restoreAllMocks());

  it('crea un usuario válido (correo en minúsculas) y va a su detalle', async () => {
    await mostrar('/admin/usuarios/nuevo');
    llenarNuevo();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    expect(await screen.findByText('Detalle del usuario')).toBeInTheDocument();
    const guardados = usuariosGuardados();
    expect(guardados).toHaveLength(3);
    expect(guardados[2]).toMatchObject({ run: '222222222', correo: 'vera@duoc.cl', tipoUsuario: 'Vendedor' });
  });

  it('muestra errores y no guarda si el formulario está vacío', async () => {
    await mostrar('/admin/usuarios/nuevo');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    expect(screen.getByText('Selecciona un tipo de usuario.')).toBeInTheDocument();
    expect(usuariosGuardados()).toHaveLength(2);
  });

  it('normaliza el RUN al salir del campo', async () => {
    await mostrar('/admin/usuarios/nuevo');
    const campo = screen.getByLabelText('RUN *');
    fireEvent.change(campo, { target: { value: '11.111.111-1' } });
    fireEvent.blur(campo);
    expect(campo).toHaveValue('111111111');
  });

  it('al cambiar la región se limpia la comuna', async () => {
    await mostrar('/admin/usuarios/nuevo');
    fireEvent.change(screen.getByLabelText('Comuna'), { target: { value: 'Coquimbo' } });
    expect(screen.getByLabelText('Comuna')).toHaveValue('Coquimbo');
    fireEvent.change(screen.getByLabelText('Región'), { target: { value: 'Región de Coquimbo' } });
    expect(screen.getByLabelText('Comuna')).toHaveValue('');
  });

  it('en edición precarga los datos y guarda los cambios', async () => {
    await mostrar('/admin/usuarios/111111111/editar');
    expect(await screen.findByDisplayValue('Ana')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Anita' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('Detalle del usuario')).toBeInTheDocument();
    expect(usuariosGuardados()[1].nombre).toBe('Anita');
  });

  it('si la persona edita su propio perfil, la sesión sigue vigente', async () => {
    await mostrar('/admin/usuarios/123456785/editar');
    expect(await screen.findByDisplayValue('Admin')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Jefe' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('Detalle del usuario')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-user')).correo).toBe('admin@duoc.cl');
  });

  it('edita un perfil sin región, comuna ni dirección (user-service no las guarda)', async () => {
    const sinDireccion = { run: '198765430', nombre: 'Pía', apellidos: 'Sola', correo: 'pia@duoc.cl', tipoUsuario: 'Vendedor', activo: true };
    localStorage.setItem('ep1-users', JSON.stringify([admin, sinDireccion]));
    localStorage.setItem('ep1-user', JSON.stringify(admin));
    render(
      <MemoryRouter initialEntries={['/admin/usuarios/198765430/editar']}>
        <Routes>
          <Route path="/admin/usuarios/:run/editar" element={<AdminUsuarioFormContainer modo="editar" />} />
          <Route path="/admin/usuarios/:run" element={<p>Detalle del usuario</p>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByDisplayValue('Pía')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Tipo de usuario *'), { target: { value: 'Cliente' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('Detalle del usuario')).toBeInTheDocument();
    expect(usuariosGuardados()[1].tipoUsuario).toBe('Cliente');
  });

  it('avisa si el usuario a editar no existe', async () => {
    await mostrar('/admin/usuarios/999999999/editar', { esperarFormulario: false });
    expect(await screen.findByRole('heading', { name: 'Usuario no encontrado' })).toBeInTheDocument();
  });

  it('avisa si el servidor no pudo guardar', async () => {
    await mostrar('/admin/usuarios/nuevo');
    llenarNuevo();
    fallarSiguientePeticion(500, 'No fue posible guardar el usuario.');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No fue posible guardar el usuario');
    expect(usuariosGuardados()).toHaveLength(2);
  });
});
