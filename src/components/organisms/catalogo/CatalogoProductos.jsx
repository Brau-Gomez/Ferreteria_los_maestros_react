// Vista completa del catálogo: resumen, filtros, aviso del carrito y grilla.
// Presentacional: compone organismos y moléculas; no tiene estado propio.
import Alert from 'react-bootstrap/Alert';
import FiltrosCatalogo from '@/components/organisms/catalogo/FiltrosCatalogo.jsx';
import GrillaProductos from '@/components/organisms/catalogo/GrillaProductos.jsx';

function CatalogoProductos({
  productos,
  filtros,
  categorias,
  aviso,
  onCambioFiltro,
  onAgregar,
  onCerrarAviso,
}) {
  return (
    <>
      <p className="text-body-secondary mb-4">
        {productos.length} productos · datos locales de demostración
      </p>

      <FiltrosCatalogo
        filtros={filtros}
        categorias={categorias}
        onCambio={onCambioFiltro}
      />

      {aviso && (
        <Alert
          variant={aviso.ok ? 'success' : 'danger'}
          dismissible
          className="mb-4"
          onClose={onCerrarAviso}
        >
          {aviso.mensaje}
        </Alert>
      )}

      <GrillaProductos productos={productos} onAgregar={onAgregar} />
    </>
  );
}

export default CatalogoProductos;