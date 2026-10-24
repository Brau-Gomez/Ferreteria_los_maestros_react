// Tarjeta de un artículo del blog (antes .blog-post). Presentacional.
// El destacado muestra todos sus párrafos y no tiene enlace;
// el resto muestra el resumen y "Leer más", como en el original.
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

function TarjetaBlog({ articulo }) {
  return (
    <Card className={`h-100 post-blog${articulo.destacado ? ' post-destacado' : ''}`}>
      <Card.Body>
        <img className="post-imagen" src={articulo.imagen} alt={articulo.alt} loading="lazy" />
        <span className="chip-categoria d-inline-block mt-3">{articulo.categoria}</span>
        <h3 className="h5 mb-2">{articulo.titulo}</h3>
        {articulo.parrafos.map((parrafo) => (
          <p key={parrafo} className="text-body-secondary">{parrafo}</p>
        ))}
        {articulo.slug && (
          <Card.Link as={Link} to={`/blog/${articulo.slug}`}>Leer más →</Card.Link>
        )}
      </Card.Body>
    </Card>
  );
}

export default TarjetaBlog;