// Catálogo de productos para páginas y componentes (Fase 2).
// El servicio siembra ep1-products la primera vez y después respeta
// los cambios guardados en localStorage (por ejemplo, los del admin).
//
// Como el catálogo vive en localStorage, se lee directamente al
// inicializar el estado y se vuelve a leer cuando cambia desde otra pestaña.
import { useEffect, useState } from 'react';
import { clavesDatos, obtenerProductos } from '../services/almacenamiento.js';

export function useProductos() {
  const [productos, setProductos] = useState(() => obtenerProductos());

  useEffect(() => {
    function alCambiarStorage(evento) {
      if (evento.key !== clavesDatos.productos && evento.key !== null) return;
      setProductos(obtenerProductos());
    }

    window.addEventListener('storage', alCambiarStorage);
    return () => window.removeEventListener('storage', alCambiarStorage);
  }, []);

  return { productos };
}
