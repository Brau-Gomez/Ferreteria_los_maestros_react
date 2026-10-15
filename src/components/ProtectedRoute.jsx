// Ruta protegida: si no hay sesión activa, redirige al ingreso.
// En la Fase B se extenderá para exigir los roles del panel admin
// (los Vendedores solo ven productos, igual que el original).
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
