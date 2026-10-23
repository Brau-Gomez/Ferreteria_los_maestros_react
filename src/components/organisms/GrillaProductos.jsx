// Grilla de tarjetas de producto, o el estado vacío si no hay resultados.
// Presentacional: recibe los productos ya filtrados y el callback de agregar.
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import TarjetaProducto from '../molecules/TarjetaProducto.jsx';

function GrillaProductos({ productos, onAgregar }) {
  if (productos.length === 0) {
    return (
      <div className="sin-resultados">
        <h2>Sin resultados</h2>
        <p className="text-body-secondary mb-0">
          Prueba otra búsqueda o categoría.
        </p>
      </div>
    );
  }

  return (
    <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
      {productos.map((producto) => (
        <Col key={producto.codigo} className="d-flex">
          <TarjetaProducto
            producto={producto}
            onAgregar={onAgregar}
            className="w-100"
          />
        </Col>
      ))}
    </Row>
  );
}

export default GrillaProductos;