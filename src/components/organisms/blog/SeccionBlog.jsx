// Sección "Blog" de la portada (antes .blog-grid): destacado a todo ancho +
// dos columnas. Presentacional: recibe los artículos por props.
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import TarjetaBlog from '@/components/molecules/TarjetaBlog.jsx';

function SeccionBlog({ articulos }) {
  const destacado = articulos.find((articulo) => articulo.destacado);
  const demas = articulos.filter((articulo) => !articulo.destacado);
  return (
    <section id="blog" className="seccion-ancla py-5">
      <Container>
        <p className="eyebrow mb-2">Novedades y consejos</p>
        <h2 className="mb-4">Consejos prácticos para tu próxima obra</h2>
        <Row className="g-4">
          {destacado && (
            <Col xs={12}><TarjetaBlog articulo={destacado} /></Col>
          )}
          {demas.map((articulo) => (
            <Col key={articulo.slug} md={6}><TarjetaBlog articulo={articulo} /></Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default SeccionBlog;