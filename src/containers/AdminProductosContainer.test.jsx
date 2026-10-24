import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider.jsx';
import AdminProductosContainer from './AdminProductosContainer.jsx';

const catalogo = [
  { codigo: 'MC001', nombre: 'Cemento gris', categoria: 'Mat. Construcción', precioVenta: 5990, stock: 80, stockMinimo: 20 },
  { codigo: 'HE001', nombre: 'Taladro', categoria: 'Herramientas', precioVenta: 39990, stock: 1, stockMinimo: 2 },
];
const admin = { run: '123456785', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true };
const vendedor = { run: '222222222', nombre: 'Vera', apellidos: 'Vende', correo: 'vera@duoc.cl', tipoUsuario: 'Vendedor', activo: true };

function mostrar(sesion, propiedades) {
  localStorage.clear();
  localStorage.setItem('ep1-products', JSON.stringify(catalogo));
  localStorage.setItem('ep1-users', JSON.stringify([admin, vendedor]));
  localStorage.setItem('ep1-user', JSON.stringify({ run: sesion.run }));
  return render(
    <MemoryRouter>
      <AuthProvider>
        <AdminProductosContainer {...propiedades} />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('AdminProductosContainer', () => {
  it('lista todo el catálogo para el administrador', () => {
    mostrar(admin);
    expect(screen.getByRole('heading', { level: 1, name: 'Productos' })).toBeInTheDocument();
    expect(screen.getByText('Cemento gris')).toBeInTheDocument();
    expect(screen.getByText('Taladro')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nuevo producto' })).toBeInTheDocument();
  });

  it('el vendedor no ve acciones de edición', () => {
    mostrar(vendedor);
    expect(screen.queryByRole('button', { name: 'Nuevo producto' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Editar' })).not.toBeInTheDocument();
  });

  it('con soloCriticos muestra únicamente los productos con stock crítico', () => {
    mostrar(admin, { soloCriticos: true });
    expect(screen.getByRole('heading', { level: 1, name: 'Productos críticos' })).toBeInTheDocument();
    expect(screen.getByText('Taladro')).toBeInTheDocument();
    expect(screen.queryByText('Cemento gris')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Nuevo producto' })).not.toBeInTheDocument();
  });
});