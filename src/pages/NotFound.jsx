// Página 404: cualquier ruta desconocida cae aquí (Fase 2).
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

function NotFound() {
  return (
    <Container className="py-5 text-center">
      <h1 className="display-1 fw-bold mb-0">404</h1>
      <h2 className="h4 mb-3">Página no encontrada</h2>
      <p className="text-muted">
        La página que buscas no existe o fue movida.
      </p>
      <Button as={Link} to="/" variant="warning">
        Volver al inicio
      </Button>
    </Container>
  );
}

export default NotFound;
