// Estado vacío del detalle cuando el código de la URL no existe en el catálogo.
import Container from 'react-bootstrap/Container';

function ProductoNoEncontrado() {
  return (
    <Container className="py-5 text-center">
      <h1 className="mb-3">Producto no encontrado</h1>
      <p className="text-body-secondary mb-0">
        Vuelve al catálogo para seleccionar uno.
      </p>
    </Container>
  );
}

export default ProductoNoEncontrado;