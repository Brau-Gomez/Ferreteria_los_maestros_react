import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminProductoDetalleContainer from '@/containers/admin/AdminProductoDetalleContainer.jsx';
import { fallarSiguientePeticion } from '@/test/servidorFalso.js';

const admin = { run: '123456785', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true };
const vendedor = { run: '111111111', nombre: 'Vera', apellidos: 'Vende', correo: 'vera@duoc.cl', tipoUsuario: 'Vendedor', activo: true };
const productos = [
  { codigo: 'M1', nombre: 'Tablón de pino', categoria: 'Madera', precioVenta: 5990, stock: 10, stockMinimo: 2 },
  { codigo: 'J1', nombre: 'Pala', categoria: 'Jardín', precioVenta: 3000, stock: 5, stockMinimo: 1 },
];

async function mostrar(codigo, { sesion = admin, esperar = true } = {}) {
  localStorage.setItem('ep1-products', JSON.stringify(productos));
  localStorage.setItem('ep1-users', JSON.stringify([admin, vendedor]));
  localStorage.setItem('ep1-user', JSON.stringify(sesion));
  render(
    <MemoryRouter initialEntries={['/admin/productos/' + codigo]}>
      <Routes>
        <Route path="/admin/productos" element={<p>Listado de productos</p>} />
        <Route path="/admin/productos/:codigo" element={<AdminProductoDetalleContainer />} />
      </Routes>
    </MemoryRouter>,
  );
  if (esperar) await screen.findByRole('heading', { name: 'Tablón de pino' });
}

// El backend desactiva (no borra) el producto eliminado.
const codigosActivos = () => JSON.parse(localStorage.getItem('ep1-products'))
  .filter((p) => p.activo !== false)
  .map((p) => p.codigo);

describe('AdminProductoDetalleContainer', () => {
  afterEach(() => vi.restoreAllMocks());

  it('muestra el producto buscado por código (sin distinguir mayúsculas)', async () => {
    await mostrar('m1');
    expect(screen.getByRole('heading', { name: 'Tablón de pino' })).toBeInTheDocument();
  });

  it('avisa cuando el producto no existe', async () => {
    await mostrar('XXX', { esperar: false });
    expect(await screen.findByRole('heading', { name: 'Producto no encontrado' })).toBeInTheDocument();
  });

  it('el administrador elimina tras confirmar y vuelve al listado', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    await mostrar('M1');
    fireEvent.click(await screen.findByRole('button', { name: 'Eliminar' }));
    expect(await screen.findByText('Listado de productos')).toBeInTheDocument();
    expect(codigosActivos()).toEqual(['J1']);
  });

  it('no elimina si se cancela la confirmación', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    await mostrar('M1');
    fireEvent.click(await screen.findByRole('button', { name: 'Eliminar' }));
    expect(screen.getByRole('heading', { name: 'Tablón de pino' })).toBeInTheDocument();
    expect(codigosActivos()).toEqual(['M1', 'J1']);
  });

  it('muestra un error si el servidor no pudo eliminar', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    await mostrar('M1');
    fallarSiguientePeticion(500, 'No fue posible eliminar el producto.');
    fireEvent.click(await screen.findByRole('button', { name: 'Eliminar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No fue posible eliminar el producto');
    expect(codigosActivos()).toEqual(['M1', 'J1']);
  });

  it('el vendedor no ve acciones de edición', async () => {
    await mostrar('M1', { sesion: vendedor });
    expect(screen.queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Editar producto' })).not.toBeInTheDocument();
  });
});
