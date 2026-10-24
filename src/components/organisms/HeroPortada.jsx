// Hero de la portada (antes .hero-view.hero-centrado): degradado azul. Presentacional.
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

function HeroPortada() {
  return (
    <section className="hero-portada text-center">
      <Container className="py-5">
        <h1 className="mb-3">Ferretería Los Maestros</h1>
        <h2 className="mb-3">
          <span className="d-block">Materiales listos</span>
          <span className="d-block">cuando la obra los necesita.</span>
        </h2>
        <p className="mb-4">Prepara tu pedido y elige retiro en tienda o despacho.</p>
        <Button as={Link} to="/productos" variant="warning" size="lg">Ver catálogo</Button>
      </Container>
    </section>
  );
}

export default HeroPortada;