// Ruta protegida: si no hay sesión activa, redirige al ingreso.
// Mientras se restaura la sesión (recarga de la página) no redirige ni muestra contenido.
// La autorización del panel admin se aplica en AdminLayout, por página y rol.
import { Navigate } from 'react-router-dom';
import { useSesion } from '../hooks/useSesion.js';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSesion();

  if (loading) {
    return null;
  }
  if (!isAuthenticated) {
    return <Navigate to="/ingreso" replace />;
  }
  return children;
}

export default ProtectedRoute;