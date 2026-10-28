import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider.jsx';
import { CartProvider } from '../context/CartProvider.jsx';
import { articulosBlog } from '../data/blog.js';
import BlogDetalle from '@/pages/blog/BlogDetalle.jsx';
import Carrito from '@/pages/carrito/Carrito.jsx';
import Contacto from '@/pages/contacto/Contacto.jsx';
import Cuenta from '@/pages/cuenta/Cuenta.jsx';
import Home from '@/pages/tienda/Home.jsx';
import Ingreso from '@/pages/auth/Ingreso.jsx';
import NotFound from '@/pages/tienda/NotFound.jsx';
import ProductoDetalle from '@/pages/catalogo/ProductoDetalle.jsx';
import Productos from '@/pages/catalogo/Productos.jsx';
import Registro from '@/pages/auth/Registro.jsx';

const cliente = { run: '222222222', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', tipoUsuario: 'Cliente', activo: true };
const producto = { codigo: 'MC001', nombre: 'Cemento gris 25 kg', marca: 'Polpaico', unidad: 'Saco', categoria: 'Materiales', precioVenta: 5990, stock: 10, stockMinimo: 1 };

// Prueba de humo: cada página se renderiza completa, con sus providers y su
// ruta, y se comprueba que muestra su encabezado principal.
function mostrar(ruta) {
  localStorage.clear();
  localStorage.setItem('ep1-users', JSON.stringify([cliente]));
  localStorage.setItem('ep1-products', JSON.stringify([producto]));
  localStorage.setItem('ep1-user', JSON.stringify({ run: cliente.run }));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/:codigo" element={<ProductoDetalle />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/ingreso" element={<Ingreso />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/cuenta" element={<Cuenta />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/blog/:slug" element={<BlogDetalle />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('páginas (pruebas de humo)', () => {
  it('Home muestra la portada', () => {
    mostrar('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Ferretería Los Maestros' })).toBeInTheDocument();
  });

  it('Productos muestra el catálogo', () => {
    mostrar('/productos');
    expect(screen.getByRole('heading', { level: 1, name: 'Encuentra lo que necesites' })).toBeInTheDocument();
    expect(screen.getByText('Cemento gris 25 kg')).toBeInTheDocument();
  });

  it('ProductoDetalle muestra la ficha del producto de la URL', () => {
    mostrar('/productos/MC001');
    expect(screen.getByRole('heading', { level: 1, name: 'Cemento gris 25 kg' })).toBeInTheDocument();
  });

  it('Carrito muestra el carrito vacío', () => {
    mostrar('/carrito');
    expect(screen.getByRole('heading', { level: 1, name: 'Tu carrito' })).toBeInTheDocument();
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
  });

  it('Ingreso muestra el formulario de inicio de sesión', () => {
    mostrar('/ingreso');
    expect(screen.getByRole('heading', { level: 1, name: 'Iniciar sesión' })).toBeInTheDocument();
  });

  it('Registro muestra el formulario de registro', () => {
    mostrar('/registro');
    expect(screen.getByRole('heading', { level: 1, name: 'Crear una cuenta' })).toBeInTheDocument();
  });

  it('Cuenta muestra el perfil del usuario con sesión', () => {
    mostrar('/cuenta');
    expect(screen.getByRole('heading', { level: 1, name: 'Mi cuenta' })).toBeInTheDocument();
  });

  it('Contacto muestra el formulario y los datos de la tienda', () => {
    mostrar('/contacto');
    expect(screen.getByRole('heading', { level: 1, name: 'Contacto' })).toBeInTheDocument();
    expect(screen.getByText('Horario de atención')).toBeInTheDocument();
  });

  it('BlogDetalle muestra el artículo pedido y avisa si no existe', () => {
    const articulo = articulosBlog.find((item) => item.slug);
    const { unmount } = mostrar(`/blog/${articulo.slug}`);
    expect(screen.getByRole('heading', { level: 1, name: articulo.titulo })).toBeInTheDocument();
    unmount();
    mostrar('/blog/no-existe');
    expect(screen.getByRole('heading', { level: 1, name: 'Artículo no encontrado' })).toBeInTheDocument();
  });

  it('NotFound se muestra en una ruta desconocida', () => {
    mostrar('/ruta-inventada');
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
  });
});