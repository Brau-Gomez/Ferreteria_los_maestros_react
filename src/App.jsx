// Raíz de la aplicación: enrutador + proveedores + estructura de página.
// El contenedor flex hace que el footer quede pegado al fondo aunque
// la página sea corta (equivalente al "footer pegajoso" del original).
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import { CartProvider } from './context/CartProvider.jsx';
import Header from './components/Header';
import Footer from './components/Footer';
import PanelCarrito from './components/PanelCarrito';
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
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {/* Scroll en cada navegación y soporte de anclas (#nosotros, #blog). */}
          <ScrollManager />
          <div className="d-flex flex-column min-vh-100">
            <Header />
            {/* Panel global: se abre desde cualquier vista al agregar. */}
            <PanelCarrito />
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
                {/* Mi cuenta exige sesión activa (Fase 7 le da contenido). */}
                <Route
                  path="/cuenta"
                  element={
                    <ProtectedRoute>
                      <Cuenta />
                    </ProtectedRoute>
                  }
                />
                <Route path="/contacto" element={<Contacto />} />
                {/* Cualquier otra ruta muestra la página 404. */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
