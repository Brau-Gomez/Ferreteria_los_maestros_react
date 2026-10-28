// Sección "Nosotros" de la portada (antes .about-grid): texto + foto de la fachada.
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function SeccionNosotros() {
  return (
    <section id="nosotros" className="seccion-ancla py-5">
      <Container>
        <Row className="g-5 align-items-center">
          <Col lg={6}>
            <p className="eyebrow mb-2">Quiénes somos</p>
            <h2 className="mb-4">22 años junto a quienes construyen La Serena</h2>
            <p className="text-body-secondary mb-3">
              Ferretería Los Maestros nació como un negocio familiar y hoy
              sigue siendo atendido por la misma familia que lo fundó, con
              tres generaciones atendiendo el mismo local en La Serena.
              Conocemos cada producto de nuestro catálogo porque los usamos,
              los recomendamos y los vendemos a diario a maestros,
              contratistas y vecinos de la zona.
            </p>
            <p className="text-body-secondary mb-0">
              Por eso no solo vendemos materiales: te ofrecemos una asesoría
              real, ayudándote a elegir el producto correcto para tu
              proyecto antes de que lo compres. Y si no puedes pasar por la
              tienda, coordinamos el despacho directo a tu obra para que no
              pierdas tiempo yendo a buscarlo.
            </p>
          </Col>
          <Col lg={6}>
            <div className="about-marco">
              <img src="/assets/img/productos/img_portada/ferreteria.png" alt="Fachada de Ferretería Los Maestros" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default SeccionNosotros;