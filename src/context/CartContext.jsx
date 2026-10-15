// Contexto del carrito de React.
// Solo el contexto: el proveedor vive en CartProvider.jsx. Se separan
// para que el Fast Refresh de Vite no pierda el estado del árbol al
// editar cualquiera de los dos archivos.
import { createContext } from 'react';

export const ContextoCarrito = createContext(null);
