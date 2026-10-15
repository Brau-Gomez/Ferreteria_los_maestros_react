// Catálogo de productos para páginas y componentes (Fase 2).
// El servicio siembra ep1-products la primera vez y después respeta
// los cambios guardados en localStorage (por ejemplo, los del admin).
//
// Como el catálogo vive en localStorage, se lee directamente al
// inicializar el estado: no hace falta un useEffect (que forzaría un
// render extra) ni un estado de carga.
import { useState } from 'react';
import { obtenerProductos } from '../services/almacenamiento.js';

export function useProductos() {
  const [productos] = useState(() => obtenerProductos());
  return { productos };
}
