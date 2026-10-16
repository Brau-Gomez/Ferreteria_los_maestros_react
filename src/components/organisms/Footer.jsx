// Pie de página compartido del sitio, con los mismos datos del original.
import Container from 'react-bootstrap/Container';

function Footer() {
  return (
    <footer className="site-footer mt-auto">
      <Container className="d-flex flex-column align-items-center gap-1 py-3 text-center">
        <strong>Ferretería Los Maestros</strong>
        <span>La Serena, Región de Coquimbo</span>
        <span>Lun a Vie 8:30-19:00 · Sáb 9:00-14:00</span>
      </Container>
    </footer>
  );
}

export default Footer;
