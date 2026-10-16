// Página de contacto: solo arma la vista. La lógica está en el container.
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ContactoContainer from '../containers/ContactoContainer.jsx';

function Contacto() {
  return (
    <Container className="py-5">
      <p className="eyebrow mb-2">Estamos para ayudarte</p>
      <h1 className="titulo-seccion mb-3">Contacto</h1>
      <p className="text-body-secondary mb-4">
        Completa el formulario para registrar tu consulta.
      </p>

      <Row className="g-4">
        <Col lg={7}>
          <ContactoContainer />
        </Col>

        <Col lg={5}>
          <aside aria-label="Datos de la ferretería">
            <h2 className="h4 mb-3">Visítanos o llámanos</h2>

            <h3 className="h6">Horario de atención</h3>
            <p className="mb-1">Lunes a viernes: 8:30 a 19:00</p>
            <p className="mb-1">Sábado: 9:00 a 14:00</p>
            <p className="mb-3">Domingo y festivos: cerrado</p>

            <h3 className="h6">Dirección</h3>
            <p className="mb-1">Av. Francisco de Aguirre 1234</p>
            <p className="mb-3">La Serena, Región de Coquimbo</p>

            <h3 className="h6">Teléfono</h3>
            <p className="mb-3">
              <a href="tel:+56512345678">+56 51 234 5678</a>
            </p>

            <h3 className="h6">Correo</h3>
            <p className="mb-0">
              <a href="mailto:contacto@losmaestros.cl">
                contacto@losmaestros.cl
              </a>
            </p>
          </aside>
        </Col>
      </Row>
    </Container>
  );
}

export default Contacto;