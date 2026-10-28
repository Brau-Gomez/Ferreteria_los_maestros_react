import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider.jsx';
import { CartProvider } from '../context/CartProvider.jsx';
import AdminCategorias from '@/pages/admin/AdminCategorias.jsx';
import AdminInicio from '@/pages/admin/AdminInicio.jsx';
import AdminOrdenDetalle from '@/pages/admin/AdminOrdenDetalle.jsx';
import AdminOrdenes from '@/pages/admin/AdminOrdenes.jsx';
import AdminPerfil from '@/pages/admin/AdminPerfil.jsx';
import AdminProductoDetalle from '@/pages/admin/AdminProductoDetalle.jsx';
import AdminProductoForm from '@/pages/admin/AdminProductoForm.jsx';
import AdminProductos from '@/pages/admin/AdminProductos.jsx';
import AdminProductosCriticos from '@/pages/admin/AdminProductosCriticos.jsx';
import AdminReportes from '@/pages/admin/AdminReportes.jsx';
import AdminUsuarioDetalle from '@/pages/admin/AdminUsuarioDetalle.jsx';
import AdminUsuarioForm from '@/pages/admin/AdminUsuarioForm.jsx';
import AdminUsuarios from '@/pages/admin/AdminUsuarios.jsx';
import Categorias from '@/pages/catalogo/Categorias.jsx';
import Checkout from '@/pages/checkout/Checkout.jsx';
import Ofertas from '@/pages/catalogo/Ofertas.jsx';

const admin = { run: '123456785', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true };
const producto = { codigo: 'MC001', nombre: 'Cemento gris 25 kg', marca: 'Polpaico', unidad: 'Saco', categoria: 'Materiales', precioVenta: 5990, stock: 10, stockMinimo: 1 };
const pedido = { id: 'PED-1', runUsuario: admin.run, total: 5990, delivery: false, productos: [{ ...producto, cantidad: 1 }] };

// Pruebas de humo de las páginas delgadas: cada una se monta con su ruta y
// sus providers y debe mostrar al menos un encabezado (la lógica de cada
// pantalla se prueba a fondo en su contenedor y su organismo).
function mostrar(rutaReal, patron, elemento) {
  localStorage.clear();
  localStorage.setItem('ep1-users', JSON.stringify([admin]));
  localStorage.setItem('ep1-products', JSON.stringify([producto]));
  localStorage.setItem('ep1-orders', JSON.stringify([pedido]));
  localStorage.setItem('ep1-user', JSON.stringify({ run: admin.run }));
  return render(
    <MemoryRouter initialEntries={[rutaReal]}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path={patron} element={elemento} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

const casos = [
  ['Categorias', '/categorias', '/categorias', <Categorias />],
  ['Ofertas', '/ofertas', '/ofertas', <Ofertas />],
  ['Checkout', '/checkout', '/checkout', <Checkout />],
  ['AdminInicio', '/admin', '/admin', <AdminInicio />],
  ['AdminProductos', '/admin/productos', '/admin/productos', <AdminProductos />],
  ['AdminProductosCriticos', '/admin/criticos', '/admin/criticos', <AdminProductosCriticos />],
  ['AdminProductoDetalle', '/admin/productos/MC001', '/admin/productos/:codigo', <AdminProductoDetalle />],
  ['AdminProductoForm (nuevo)', '/admin/productos/nuevo', '/admin/productos/nuevo', <AdminProductoForm modo="nuevo" />],
  ['AdminProductoForm (editar)', '/admin/productos/MC001/editar', '/admin/productos/:codigo/editar', <AdminProductoForm modo="editar" />],
  ['AdminOrdenes', '/admin/ordenes', '/admin/ordenes', <AdminOrdenes />],
  ['AdminOrdenDetalle', '/admin/ordenes/PED-1', '/admin/ordenes/:id', <AdminOrdenDetalle />],
  ['AdminReportes', '/admin/reportes', '/admin/reportes', <AdminReportes />],
  ['AdminCategorias', '/admin/categorias', '/admin/categorias', <AdminCategorias />],
  ['AdminPerfil', '/admin/perfil', '/admin/perfil', <AdminPerfil />],
  ['AdminUsuarios', '/admin/usuarios', '/admin/usuarios', <AdminUsuarios />],
  ['AdminUsuarioDetalle', '/admin/usuarios/123456785', '/admin/usuarios/:run', <AdminUsuarioDetalle />],
  ['AdminUsuarioForm (nuevo)', '/admin/usuarios/nuevo', '/admin/usuarios/nuevo', <AdminUsuarioForm modo="nuevo" />],
  ['AdminUsuarioForm (editar)', '/admin/usuarios/123456785/editar', '/admin/usuarios/:run/editar', <AdminUsuarioForm modo="editar" />],
];

describe('páginas delgadas (pruebas de humo)', () => {
  it.each(casos)('%s se monta y muestra un encabezado', (_nombre, ruta, patron, elemento) => {
    mostrar(ruta, patron, elemento);
    expect(screen.getAllByRole('heading').length).toBeGreaterThan(0);
  });
});