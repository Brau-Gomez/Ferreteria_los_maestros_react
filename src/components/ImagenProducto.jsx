// Imagen de un producto con respaldo si falta o falla la carga.
// Portado desde imagenProductoHtml() + activarRespaldoImagenes() del
// js/compartido/utilidades.js original: la tarjeta sigue siendo legible
// aunque la imagen no exista (el <img> en error se reemplazaba por texto).
import { useState } from 'react';
import { resolverImagen } from '../utils/imagenes.js';

function ImagenProductoCargable({ producto, ruta, className }) {
  const [fallida, setFallida] = useState(false);

  if (fallida) {
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

function ImagenProducto({ producto, className = '' }) {
  const ruta = resolverImagen(producto.imagen);

  if (!ruta) {
    return (
      <p className={`producto-imagen-fallback ${className}`.trim()}>
        Sin imagen disponible
      </p>
    );
  }

  return (
    <ImagenProductoCargable
      key={JSON.stringify([producto.codigo, ruta])}
      producto={producto}
      ruta={ruta}
      className={className}
    />
  );
}

export default ImagenProducto;
