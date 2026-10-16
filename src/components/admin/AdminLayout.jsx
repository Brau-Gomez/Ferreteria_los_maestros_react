// Estructura y autorización del panel, portada desde admin/index.html.
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useSesion } from '../../hooks/useSesion.js';

function AdminLayout() {
  const { usuario, salir } = useSesion();
  const location = useLocation();
  const navigate = useNavigate();
  const esAdmin = usuario?.tipoUsuario === 'Administrador';
  const esRutaProductoPermitida = location.pathname === '/admin/productos' ||
    (/^\/admin\/productos\/[^/]+$/.test(location.pathname) &&
      !['nuevo', 'editar'].includes(location.pathname.split('/').at(-1)));

  if (!usuario) return <Navigate to="/ingreso" replace />;
  if (usuario.tipoUsuario === 'Vendedor' && location.pathname === '/admin') {
    return <Navigate to="/admin/productos" replace />;
  }
  if (usuario.tipoUsuario === 'Vendedor' && !esRutaProductoPermitida) {
    return <Navigate to="/admin/productos" replace />;
  }
  if (!esAdmin && usuario.tipoUsuario !== 'Vendedor') {
    return (
      <main className="container py-5">
        <h1>Acceso restringido</h1>
        <p>Inicia sesión con un perfil autorizado.</p>
        <Link to="/ingreso">Ir al inicio de sesión</Link>
      </main>
    );
  }

  function alCerrarSesion() {
    if (salir()) navigate('/ingreso');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/admin" aria-label="Ir al inicio del panel">
          <span className="admin-brand-mark" aria-hidden="true">⌂</span>
          <span><strong>Los Maestros</strong><small>Administración</small></span>
        </Link>
        <p className="admin-context">Control de catálogo y usuarios</p>
        <nav className="admin-nav" aria-label="Navegación administrativa">
          {esAdmin && <NavLink to="/admin" end>Resumen</NavLink>}
          <NavLink to="/admin/productos">Productos</NavLink>
          {esAdmin && <NavLink to="/admin/usuarios">Usuarios</NavLink>}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/">Volver a la tienda</Link>
          <Button variant="link" className="text-button" onClick={alCerrarSesion}>
            Cerrar sesión
          </Button>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <p>Sesión local de demostración</p>
          <div className="admin-user-chip">
            <span aria-hidden="true">{usuario.nombre.charAt(0).toUpperCase()}</span>
            {usuario.nombre} · {usuario.tipoUsuario}
          </div>
        </header>
        <main className="admin-main"><Outlet /></main>
      </div>
    </div>
  );
}

export default AdminLayout;
