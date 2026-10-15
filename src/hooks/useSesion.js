// Acceso al contexto de sesión.
// Debe usarse dentro de <AuthProvider> (ver App.jsx).
import { useContext } from 'react';
import { ContextoAuth } from '../context/AuthContext.jsx';

export function useSesion() {
  const contexto = useContext(ContextoAuth);
  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de AuthProvider.');
  }
  return contexto;
}
