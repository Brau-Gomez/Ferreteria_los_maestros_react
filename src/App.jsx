// Raíz de la aplicación: enrutador + proveedores + estructura de página.
// El contenedor flex hace que el footer quede pegado al fondo aunque
// la página sea corta (equivalente al "footer pegajoso" del original).
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import { CartProvider } from './context/CartProvider.jsx';
// Componentes por nivel atómico (lineamiento EP2): organisms son las
// secciones visuales; ProtectedRoute y ScrollManager son piezas de
// comportamiento/ruta, por eso quedan en la raíz de components/.
import Header from './components/organisms/Header';
import Footer from './components/organisms/Footer';
import PanelCarrito from './components/organisms/PanelCarrito';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollManager from './components/ScrollManager';
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Carrito from './pages/Carrito';
import Ingreso from './pages/Ingreso';
import Registro from './pages/Registro';
import Cuenta from './pages/Cuenta';
import Contacto from './pages/Contacto';
import BlogDetalle from './pages/BlogDetalle';
import NotFound from './pages/NotFound';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminInicio from './pages/AdminInicio.jsx';
import AdminProductos from './pages/AdminProductos.jsx';
import AdminProductoDetalle from './pages/AdminProductoDetalle.jsx';
import AdminProductoForm from './pages/AdminProductoForm.jsx';
import AdminUsuarios from './pages/AdminUsuarios.jsx';
import AdminUsuarioDetalle from './pages/AdminUsuarioDetalle.jsx';
import AdminUsuarioForm from './pages/AdminUsuarioForm.jsx';

function ContenidoApp() {
  const location = useLocation();
  const enAdministracion = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Scroll en cada navegación y soporte de anclas (#nosotros, #blog). */}
      <ScrollManager />
      <div className="d-flex flex-column min-vh-100">
        {!enAdministracion && <Header />}
        {!enAdministracion && <PanelCarrito />}
        <main className="flex-grow-1">
          <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Productos />} />
                {/* Detalle por código: antes producto-detalle.html?codigo=XXX */}
                <Route
                  path="/productos/:codigo"
                  element={<ProductoDetalle />}
                />
                <Route path="/carrito" element={<Carrito />} />
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
                  <Route path="productos/nuevo" element={<AdminProductoForm modo="nuevo" />} />
                  <Route path="productos/:codigo/editar" element={<AdminProductoForm modo="editar" />} />
                  <Route path="productos/:codigo" element={<AdminProductoDetalle />} />
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
