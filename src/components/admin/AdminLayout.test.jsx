import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthProvider.jsx';
import AdminLayout from './AdminLayout.jsx';

const admin = { run: '123456785', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true };
const vendedor = { run: '222222222', nombre: 'Vera', apellidos: 'Vende', correo: 'vera@duoc.cl', tipoUsuario: 'Vendedor', activo: true };
const cliente = { run: '333333333', nombre: 'Ana', apellidos: 'Cliente', correo: 'ana@gmail.com', tipoUsuario: 'Cliente', activo: true };

function mostrar(ruta, sesion) {
  localStorage.clear();
  localStorage.setItem('ep1-users', JSON.stringify([admin, vendedor, cliente]));
  if (sesion) localStorage.setItem('ep1-user', JSON.stringify({ run: sesion.run }));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <Routes>
          <Route path="/ingreso" element={<p>Pantalla de ingreso</p>} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<p>Contenido resumen</p>} />
            <Route path="productos" element={<p>Contenido productos</p>} />
            <Route path="productos/nuevo" element={<p>Contenido nuevo</p>} />
            <Route path="usuarios" element={<p>Contenido usuarios</p>} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('AdminLayout', () => {
  it('sin sesión redirige al ingreso', () => {
    mostrar('/admin');
    expect(screen.getByText('Pantalla de ingreso')).toBeInTheDocument();
  });

  it('un cliente ve el aviso de acceso restringido', () => {
    mostrar('/admin', cliente);
    expect(screen.getByText('Acceso restringido')).toBeInTheDocument();
  });

  it('el administrador ve todo el menú y el contenido', () => {
    mostrar('/admin', admin);
    expect(screen.getByText('Contenido resumen')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Resumen' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Usuarios' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Stock crítico' })).toBeInTheDocument();
  });

  it('el vendedor entrando a /admin va al listado de productos y no ve Usuarios', () => {
    mostrar('/admin', vendedor);
    expect(screen.getByText('Contenido productos')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Usuarios' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Stock crítico' })).not.toBeInTheDocument();
  });

  it('el vendedor no puede abrir rutas de edición', () => {
    mostrar('/admin/productos/nuevo', vendedor);
    expect(screen.getByText('Contenido productos')).toBeInTheDocument();
  });

  it('cerrar sesión lleva a la pantalla de ingreso', () => {
    mostrar('/admin', admin);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(screen.getByText('Pantalla de ingreso')).toBeInTheDocument();
  });
});