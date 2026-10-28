// Página de contacto: solo arma la vista. La lógica del formulario vive en
// ContactoContainer y los datos de la tienda en el organismo DatosTienda.
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import MapaDespacho from '@/components/organisms/checkout/MapaDespacho.jsx';
import DatosTienda from '@/components/organisms/tienda/DatosTienda.jsx';
import ContactoContainer from '@/containers/contacto/ContactoContainer.jsx';

function Contacto() {
  return (
    <Container className="py-5">
      <header className="mb-4">
        <p className="eyebrow mb-2">Estamos para ayudarte</p>
        <h1 className="titulo-seccion mb-2">Contacto</h1>
        <p>Completa el formulario para registrar tu consulta.</p>
      </header>

      <Row className="g-4 contacto-grid">
        <Col lg={7}>
          <ContactoContainer />
        </Col>
        <Col lg={5}>
          <DatosTienda />
        </Col>
      </Row>

      <section className="mt-5" aria-labelledby="titulo-mapa">
        <h2 id="titulo-mapa" className="mb-3">Dónde estamos y dónde despachamos</h2>
        <MapaDespacho />
      </section>
    </Container>
  );
}

export default Contacto;