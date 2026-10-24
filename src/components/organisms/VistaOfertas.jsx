// Vista de ofertas: aviso del carrito y grilla de productos en oferta.
// Presentacional.
import Alert from 'react-bootstrap/Alert';
import GrillaProductos from './GrillaProductos.jsx';

function VistaOfertas({ productos, aviso, onAgregar, onCerrarAviso }) {
  return (
    <>
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
      {productos.length === 0 ? (
        <div className="sin-resultados">
          <h2>No hay ofertas por ahora</h2>
          <p className="text-body-secondary mb-0">Vuelve pronto.</p>
        </div>
      ) : (
        <GrillaProductos productos={productos} onAgregar={onAgregar} />
      )}
    </>
  );
}

export default VistaOfertas;