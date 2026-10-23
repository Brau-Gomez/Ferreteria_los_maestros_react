// Catálogo de productos de la tienda. La página solo arma el encabezado;
// los datos, filtros y carrito los maneja ProductosContainer.
import Container from 'react-bootstrap/Container';
import ProductosContainer from '../containers/ProductosContainer.jsx';

function Productos() {
  return (
    <Container className="py-5">
      <p className="eyebrow mb-2">Catálogo de materiales</p>
      <h1 className="titulo-seccion mb-3">Encuentra lo que necesites</h1>
      <ProductosContainer />
    </Container>
  );
}

export default Productos;