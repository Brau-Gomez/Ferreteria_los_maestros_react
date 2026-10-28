// Raíz de la aplicación: enrutador + proveedores + estructura de página.
// El contenedor flex hace que el footer quede pegado al fondo aunque
// la página sea corta (equivalente al "footer pegajoso" del original).
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import { CartProvider } from './context/CartProvider.jsx';
// Componentes por nivel atómico (lineamiento EP2): organisms son las
// secciones visuales; ProtectedRoute y ScrollManager son piezas de
// comportamiento/ruta, por eso quedan en la raíz de components/.
import HeaderContainer from '@/containers/layout/HeaderContainer.jsx';
import Footer from '@/components/organisms/tienda/Footer.jsx';
import PanelCarritoContainer from '@/containers/carrito/PanelCarritoContainer.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollManager from './components/ScrollManager';
import Home from '@/pages/tienda/Home.jsx';
import Productos from '@/pages/catalogo/Productos.jsx';
import ProductoDetalle from '@/pages/catalogo/ProductoDetalle.jsx';
import Categorias from '@/pages/catalogo/Categorias.jsx';
import CategoriaDetalle from '@/pages/catalogo/CategoriaDetalle.jsx';
import Ofertas from '@/pages/catalogo/Ofertas.jsx';
import Carrito from '@/pages/carrito/Carrito.jsx';
import Checkout from '@/pages/checkout/Checkout.jsx';
import Ingreso from '@/pages/auth/Ingreso.jsx';
import Registro from '@/pages/auth/Registro.jsx';
import Cuenta from '@/pages/cuenta/Cuenta.jsx';
import Contacto from '@/pages/contacto/Contacto.jsx';
import BlogDetalle from '@/pages/blog/BlogDetalle.jsx';
import NotFound from '@/pages/tienda/NotFound.jsx';
import AdminLayout from '@/components/organisms/admin/AdminLayout.jsx';
import AdminInicio from '@/pages/admin/AdminInicio.jsx';
import AdminProductos from '@/pages/admin/AdminProductos.jsx';
import AdminProductosCriticos from '@/pages/admin/AdminProductosCriticos.jsx';
import AdminReportes from '@/pages/admin/AdminReportes.jsx';
import AdminPerfil from '@/pages/admin/AdminPerfil.jsx';
import AdminCategorias from '@/pages/admin/AdminCategorias.jsx';
import AdminOrdenes from '@/pages/admin/AdminOrdenes.jsx';
import AdminOrdenDetalle from '@/pages/admin/AdminOrdenDetalle.jsx';
import AdminProductoDetalle from '@/pages/admin/AdminProductoDetalle.jsx';
import AdminProductoForm from '@/pages/admin/AdminProductoForm.jsx';
import AdminUsuarios from '@/pages/admin/AdminUsuarios.jsx';
import AdminUsuarioDetalle from '@/pages/admin/AdminUsuarioDetalle.jsx';
import AdminUsuarioForm from '@/pages/admin/AdminUsuarioForm.jsx';

function ContenidoApp() {
  const location = useLocation();
  const enAdministracion = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Scroll en cada navegación y soporte de anclas (#nosotros, #blog). */}
      <ScrollManager />
      <div className="d-flex flex-column min-vh-100">
        {!enAdministracion && <HeaderContainer />}
        {!enAdministracion && <PanelCarritoContainer />}
        <main className="flex-grow-1">
          <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Productos />} />
                {/* Detalle por código: antes producto-detalle.html?codigo=XXX */}
                <Route
                  path="/productos/:codigo"
                  element={<ProductoDetalle />}
                />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/categorias/:categoria" element={<CategoriaDetalle />} />
                <Route path="/ofertas" element={<Ofertas />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route path="/ingreso" element={<Ingreso />} />
                <Route path="/registro" element={<Registro />} />
                {/* Mi cuenta requiere una sesión activa. */}
                <Route
                  path="/cuenta"
                  element={
                    <ProtectedRoute>
                      <Cuenta />
                    </ProtectedRoute>
                  }
                />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/blog/:slug" element={<BlogDetalle />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminInicio />} />
                  <Route path="productos" element={<AdminProductos />} />
                  <Route path="criticos" element={<AdminProductosCriticos />} />
                  <Route path="productos/nuevo" element={<AdminProductoForm modo="nuevo" />} />
                  <Route path="productos/:codigo/editar" element={<AdminProductoForm modo="editar" />} />
                  <Route path="productos/:codigo" element={<AdminProductoDetalle />} />
                  <Route path="ordenes" element={<AdminOrdenes />} />
                  <Route path="ordenes/:id" element={<AdminOrdenDetalle />} />
                  <Route path="reportes" element={<AdminReportes />} />
                  <Route path="categorias" element={<AdminCategorias />} />
                  <Route path="perfil" element={<AdminPerfil />} />
                  <Route path="usuarios" element={<AdminUsuarios />} />
                  <Route path="usuarios/nuevo" element={<AdminUsuarioForm modo="nuevo" />} />
                  <Route path="usuarios/:run/editar" element={<AdminUsuarioForm modo="editar" />} />
                  <Route path="usuarios/:run" element={<AdminUsuarioDetalle />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                {/* Cualquier otra ruta muestra la página 404. */}
                <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!enAdministracion && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ContenidoApp />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
