// Portada del sitio.
// Porta el index.html original: hero centrado, sección Nosotros y Blog,
// ahora con el layout de Bootstrap (Container/Row/Col y cards). Los
// artículos viven en src/data/blog.js para no mezclar contenido con marcado.
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { articulosBlog } from '../data/blog.js';

// Tarjeta de un artículo del blog (antes .blog-post).
// El destacado muestra todos sus párrafos y no tiene enlace;
// el resto muestra el resumen y "Leer más", como en el original.
function PostBlog({ articulo }) {
  return (
    <Card
      className={`h-100 post-blog${articulo.destacado ? ' post-destacado' : ''}`}
    >
      <Card.Body>
        <img
          className="post-imagen"
          src={articulo.imagen}
          alt={articulo.alt}
          loading="lazy"
        />
        <span className="chip-categoria d-inline-block mt-3">
          {articulo.categoria}
        </span>
        <h3 className="h5 mb-2">{articulo.titulo}</h3>
        {articulo.parrafos.map((parrafo) => (
          <p key={parrafo} className="text-body-secondary">
            {parrafo}
          </p>
        ))}
        {articulo.slug && (
          <Card.Link as={Link} to={`/blog/${articulo.slug}`}>
            Leer más →
          </Card.Link>
        )}
      </Card.Body>
    </Card>
  );
}

function Home() {
  const destacado = articulosBlog.find((articulo) => articulo.destacado);
  const demas = articulosBlog.filter((articulo) => !articulo.destacado);

  return (
    <>
      {/* Hero centrado (antes .hero-view.hero-centrado): degradado azul. */}
      <section className="hero-portada text-center">
        <Container className="py-5">
          <h1 className="mb-3">Ferretería Los Maestros</h1>
          <h2 className="mb-3">
            <span className="d-block">Materiales listos</span>
            <span className="d-block">cuando la obra los necesita.</span>
          </h2>
          <p className="mb-4">
            Prepara tu pedido y elige retiro en tienda o despacho.
          </p>
          <Button as={Link} to="/productos" variant="warning" size="lg">
            Ver catálogo
          </Button>
        </Container>
      </section>

      {/* Nosotros (antes .about-grid): texto + foto de la fachada. */}
      <section id="nosotros" className="seccion-ancla py-5">
        <Container>
          <Row className="g-5 align-items-center">
            <Col lg={6}>
              <p className="eyebrow mb-2">Quiénes somos</p>
              <h2 className="mb-4">
                22 años junto a quienes construyen La Serena
              </h2>
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
                <img
                  src="/assets/img/productos/img_portada/ferreteria.png"
                  alt="Fachada de Ferretería Los Maestros"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Blog (antes .blog-grid): destacado a todo ancho + dos columnas. */}
      <section id="blog" className="seccion-ancla py-5">
        <Container>
          <p className="eyebrow mb-2">Novedades y consejos</p>
          <h2 className="mb-4">Consejos prácticos para tu próxima obra</h2>
          <Row className="g-4">
            {destacado && (
              <Col xs={12}>
                <PostBlog articulo={destacado} />
              </Col>
            )}
            {demas.map((articulo) => (
              <Col key={articulo.slug} md={6}>
                <PostBlog articulo={articulo} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Home;
