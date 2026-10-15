// Acceso al contexto del carrito.
// Debe usarse dentro de <CartProvider> (ver App.jsx).
import { useContext } from 'react';
import { ContextoCarrito } from '../context/CartContext.jsx';

export function useCarrito() {
  const contexto = useContext(ContextoCarrito);
  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de CartProvider.');
  }
  return contexto;
}
