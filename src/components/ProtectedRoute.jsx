// Ruta protegida: si no hay sesión activa, redirige al ingreso.
// La autorización del panel admin se aplica en AdminLayout, por página y rol.
import { Navigate } from 'react-router-dom';
import { useSesion } from '../hooks/useSesion.js';

function ProtectedRoute({ children }) {
  const { usuario } = useSesion();
  if (!usuario) {
    return <Navigate to="/ingreso" replace />;
  }
  return children;
}

export default ProtectedRoute;
