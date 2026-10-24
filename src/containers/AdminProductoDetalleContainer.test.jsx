import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider.jsx';
import AdminProductoDetalleContainer from './AdminProductoDetalleContainer.jsx';

const admin = { run: '123456785', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true };
const vendedor = { run: '111111111', nombre: 'Vera', apellidos: 'Vende', correo: 'vera@duoc.cl', tipoUsuario: 'Vendedor', activo: true };
const productos = [
  { codigo: 'M1', nombre: 'Tablón de pino', categoria: 'Madera', precioVenta: 5990, stock: 10, stockMinimo: 2 },
  { codigo: 'J1', nombre: 'Pala', categoria: 'Jardín', precioVenta: 3000, stock: 5, stockMinimo: 1 },
];

function mostrar(codigo, sesion = admin) {
  localStorage.clear();
  localStorage.setItem('ep1-products', JSON.stringify(productos));
  localStorage.setItem('ep1-users', JSON.stringify([admin, vendedor]));
  localStorage.setItem('ep1-user', JSON.stringify({ run: sesion.run }));
  return render(
    <MemoryRouter initialEntries={['/admin/productos/' + codigo]}>
      <AuthProvider>
        <Routes>
          <Route path="/admin/productos" element={<p>Listado de productos</p>} />
          <Route path="/admin/productos/:codigo" element={<AdminProductoDetalleContainer />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('AdminProductoDetalleContainer', () => {
  afterEach(() => vi.restoreAllMocks());

  it('muestra el producto buscado por código (sin distinguir mayúsculas)', () => {
    mostrar('m1');
    expect(screen.getByRole('heading', { name: 'Tablón de pino' })).toBeInTheDocument();
  });

  it('avisa cuando el producto no existe', () => {
    mostrar('XXX');
    expect(screen.getByRole('heading', { name: 'Producto no encontrado' })).toBeInTheDocument();
  });

  it('el administrador elimina tras confirmar y vuelve al listado', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mostrar('M1');
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(screen.getByText('Listado de productos')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-products')).map((p) => p.codigo)).toEqual(['J1']);
  });

  it('no elimina si se cancela la confirmación', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    mostrar('M1');
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(screen.getByRole('heading', { name: 'Tablón de pino' })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-products'))).toHaveLength(2);
  });

  it('muestra un error si no se puede guardar la eliminación', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mostrar('M1');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('lleno'); });
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('No fue posible eliminar el producto');
  });

  it('el vendedor no ve acciones de edición', () => {
    mostrar('M1', vendedor);
    expect(screen.queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Editar producto' })).not.toBeInTheDocument();
  });
});