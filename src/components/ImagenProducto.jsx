// Imagen de un producto con respaldo si falta o falla la carga.
// Portado desde imagenProductoHtml() + activarRespaldoImagenes() del
// js/compartido/utilidades.js original: la tarjeta sigue siendo legible
// aunque la imagen no exista (el <img> en error se reemplazaba por texto).
import { useState } from 'react';
import { resolverImagen } from '../utils/imagenes.js';

function ImagenProducto({ producto, className = '' }) {
  const [fallida, setFallida] = useState(false);
  const ruta = resolverImagen(producto.imagen);

  // Sin ruta utilizable o con error de carga: texto de respaldo.
  if (!ruta || fallida) {
    return (
      <p className={`producto-imagen-fallback ${className}`.trim()}>
        Sin imagen disponible
      </p>
    );
  }
  return (
    <img
      className={`producto-imagen ${className}`.trim()}
      src={ruta}
      alt={producto.nombre}
      loading="lazy"
      onError={() => setFallida(true)}
    />
  );
}

export default ImagenProducto;
