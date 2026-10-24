// Grilla de categorías del catálogo. Presentacional: recibe la lista
// [{ categoria, cantidad }] ya calculada por el container.
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import TarjetaCategoria from '../molecules/TarjetaCategoria.jsx';

function ListaCategorias({ categorias }) {
  return (
    <Row xs={1} sm={2} lg={3} className="g-4">
      {categorias.map((item) => (
        <Col key={item.categoria} className="d-flex">
          <TarjetaCategoria categoria={item.categoria} cantidad={item.cantidad} />
        </Col>
      ))}
    </Row>
  );
}

export default ListaCategorias;