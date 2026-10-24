// Tarjeta de una categoría: nombre, cantidad de productos y enlace a su
// listado. Presentacional.
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

function TarjetaCategoria({ categoria, cantidad }) {
  return (
    <Card className="tarjeta-producto h-100">
      <Card.Body className="d-flex flex-column">
        <h2 className="h5">{categoria}</h2>
        <p className="text-body-secondary">
          {cantidad === 1 ? '1 producto' : `${cantidad} productos`}
        </p>
        <Link
          to={`/categorias/${encodeURIComponent(categoria)}`}
          className="mt-auto stretched-link"
        >
          Ver {categoria}
        </Link>
      </Card.Body>
    </Card>
  );
}

export default TarjetaCategoria;