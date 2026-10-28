import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider.jsx';
import AdminUsuarioFormContainer from '@/containers/admin/AdminUsuarioFormContainer.jsx';

const admin = { run: '123456785', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', fechaNacimiento: '', tipoUsuario: 'Administrador', region: 'Región de Coquimbo', comuna: 'La Serena', direccion: 'Calle 1', activo: true };
const cliente = { run: '111111111', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', fechaNacimiento: '', tipoUsuario: 'Cliente', region: 'Región de Coquimbo', comuna: 'Ovalle', direccion: 'Calle 2', activo: true };

function mostrar(modo, ruta) {
  localStorage.clear();
  localStorage.setItem('ep1-users', JSON.stringify([admin, cliente]));
  localStorage.setItem('ep1-user', JSON.stringify({ run: admin.run }));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <Routes>
          <Route path="/admin/usuarios/nuevo" element={<AdminUsuarioFormContainer modo="nuevo" />} />
          <Route path="/admin/usuarios/:run/editar" element={<AdminUsuarioFormContainer modo="editar" />} />
          <Route path="/admin/usuarios/:run" element={<p>Detalle del usuario</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

function llenarNuevo(run = '222222222') {
  fireEvent.change(screen.getByLabelText('RUN *'), { target: { value: run } });
  fireEvent.change(screen.getByLabelText('Tipo de usuario *'), { target: { value: 'Vendedor' } });
  fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Vera' } });
  fireEvent.change(screen.getByLabelText('Apellidos *'), { target: { value: 'Vende' } });
  fireEvent.change(screen.getByLabelText('Correo *'), { target: { value: 'VERA@duoc.cl ' } });
  fireEvent.change(screen.getByLabelText('Comuna *'), { target: { value: 'Coquimbo' } });
  fireEvent.change(screen.getByLabelText('Dirección *'), { target: { value: 'Av. Principal 123' } });
}

describe('AdminUsuarioFormContainer', () => {
  afterEach(() => vi.restoreAllMocks());

  it('crea un usuario válido (correo en minúsculas) y va a su detalle', () => {
    mostrar('nuevo', '/admin/usuarios/nuevo');
    llenarNuevo();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    expect(screen.getByText('Detalle del usuario')).toBeInTheDocument();
    const guardados = JSON.parse(localStorage.getItem('ep1-users'));
    expect(guardados).toHaveLength(3);
    expect(guardados[2]).toMatchObject({ run: '222222222', correo: 'vera@duoc.cl', activo: true });
  });

  it('muestra errores y no guarda si el formulario está vacío', () => {
    mostrar('nuevo', '/admin/usuarios/nuevo');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    expect(screen.getByText('Selecciona un tipo de usuario.')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-users'))).toHaveLength(2);
  });

  it('normaliza el RUN al salir del campo', () => {
    mostrar('nuevo', '/admin/usuarios/nuevo');
    const campo = screen.getByLabelText('RUN *');
    fireEvent.change(campo, { target: { value: '11.111.111-1' } });
    fireEvent.blur(campo);
    expect(campo).toHaveValue('111111111');
  });

  it('al cambiar la región se limpia la comuna', () => {
    mostrar('nuevo', '/admin/usuarios/nuevo');
    fireEvent.change(screen.getByLabelText('Comuna *'), { target: { value: 'Ovalle' } });
    fireEvent.change(screen.getByLabelText('Región *'), { target: { value: 'Región de Coquimbo' } });
    expect(screen.getByLabelText('Comuna *')).toHaveValue('');
  });

  it('en edición precarga los datos y guarda los cambios', () => {
    mostrar('editar', '/admin/usuarios/111111111/editar');
    expect(screen.getByLabelText('Nombre *')).toHaveValue('Ana');
    fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Anita' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(screen.getByText('Detalle del usuario')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-users'))[1].nombre).toBe('Anita');
  });

  it('si la persona edita su propio perfil, la sesión sigue vigente', () => {
    mostrar('editar', '/admin/usuarios/123456785/editar');
    fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Jefe' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(screen.getByText('Detalle del usuario')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-user'))).toEqual({ run: '123456785' });
  });

  it('avisa si el usuario a editar no existe', () => {
    mostrar('editar', '/admin/usuarios/999999999/editar');
    expect(screen.getByRole('heading', { name: 'Usuario no encontrado' })).toBeInTheDocument();
  });

  it('avisa si no se pudo guardar', () => {
    mostrar('nuevo', '/admin/usuarios/nuevo');
    llenarNuevo();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('lleno'); });
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    expect(screen.getByRole('alert')).toHaveTextContent('No fue posible guardar el usuario');
  });
});