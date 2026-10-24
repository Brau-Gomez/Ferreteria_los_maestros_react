import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthProvider.jsx';
import AdminLayout from './AdminLayout.jsx';

const admin = { run: '123456785', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true };
const vendedor = { run: '222222222', nombre: 'Vera', apellidos: 'Vende', correo: 'vera@duoc.cl', tipoUsuario: 'Vendedor', activo: true };

function mostrar(sesion) {
  localStorage.clear();
  localStorage.setItem('ep1-users', JSON.stringify([admin, vendedor]));
  localStorage.setItem('ep1-user', JSON.stringify({ run: sesion.run }));
  return render(
    <MemoryRouter initialEntries={['/admin/ordenes']}>
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="ordenes" element={<p>Contenido órdenes</p>} />
            <Route path="productos" element={<p>Contenido productos</p>} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('AdminLayout: Órdenes', () => {
  it('el administrador ve el enlace y la página de órdenes', () => {
    mostrar(admin);
    expect(screen.getByRole('link', { name: 'Órdenes' })).toHaveAttribute('href', '/admin/ordenes');
    expect(screen.getByText('Contenido órdenes')).toBeInTheDocument();
  });

  it('el vendedor no accede a órdenes y vuelve a productos', () => {
    mostrar(vendedor);
    expect(screen.getByText('Contenido productos')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Órdenes' })).not.toBeInTheDocument();
  });
});