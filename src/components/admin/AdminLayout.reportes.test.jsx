import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthProvider.jsx';
import AdminLayout from './AdminLayout.jsx';

const admin = { run: '123456785', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true };
const vendedor = { run: '222222222', nombre: 'Vera', apellidos: 'Vende', correo: 'vera@duoc.cl', tipoUsuario: 'Vendedor', activo: true };

function mostrar(sesion, ruta) {
  localStorage.clear();
  localStorage.setItem('ep1-users', JSON.stringify([admin, vendedor]));
  localStorage.setItem('ep1-user', JSON.stringify({ run: sesion.run }));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="reportes" element={<p>Contenido reportes</p>} />
            <Route path="perfil" element={<p>Contenido perfil</p>} />
            <Route path="productos" element={<p>Contenido productos</p>} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('AdminLayout: Reportes y Mi perfil', () => {
  it('el administrador ve Reportes y Mi perfil', () => {
    mostrar(admin, '/admin/reportes');
    expect(screen.getByRole('link', { name: 'Reportes' })).toHaveAttribute('href', '/admin/reportes');
    expect(screen.getByRole('link', { name: 'Mi perfil' })).toBeInTheDocument();
    expect(screen.getByText('Contenido reportes')).toBeInTheDocument();
  });

  it('el vendedor no accede a reportes', () => {
    mostrar(vendedor, '/admin/reportes');
    expect(screen.getByText('Contenido productos')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Reportes' })).not.toBeInTheDocument();
  });

  it('el vendedor sí accede a su perfil', () => {
    mostrar(vendedor, '/admin/perfil');
    expect(screen.getByText('Contenido perfil')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mi perfil' })).toBeInTheDocument();
  });
});