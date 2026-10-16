// Artículos completos del blog: antes tienda/blog-pintura.html y blog-taladro.html.
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { articulosBlog } from '../data/blog.js';

function BlogDetalle() {
  const { slug } = useParams();
  const articulo = articulosBlog.find((item) => item.slug === slug);

  useEffect(() => {
    const tituloAnterior = document.title;
    document.title = articulo
      ? `${articulo.titulo} | Ferretería Los Maestros`
      : 'Artículo no encontrado | Ferretería Los Maestros';
    return () => {
      document.title = tituloAnterior;
    };
  }, [articulo]);

  if (!articulo) {
    return (
      <Container className="py-5 text-center">
        <h1>Artículo no encontrado</h1>
        <p>El artículo que buscas no existe o fue movido.</p>
        <Button as={Link} to="/#blog" variant="warning">Volver al blog</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <article className="blog-detalle pagina-angosta mx-auto">
        <Button as={Link} to="/#blog" variant="link" className="p-0 mb-3">
          ← Volver al blog
        </Button>
        <p className="eyebrow">{articulo.categoria}</p>
        <h1>{articulo.titulo}</h1>
        <p className="blog-detalle-bajada">{articulo.bajada}</p>
        <img className="blog-detalle-imagen" src={articulo.imagen} alt={articulo.detalleAlt} />

        {articulo.secciones.map((seccion) => (
          <section key={seccion.titulo}>
            <h2>{seccion.titulo}</h2>
            {seccion.parrafos?.map((parrafo) => <p key={parrafo}>{parrafo}</p>)}
            {seccion.lista && (
              seccion.ordenada ? (
                <ol>{seccion.lista.map((item) => <li key={item}><strong>{item.split('|')[0]}</strong>{item.split('|')[1]}</li>)}</ol>
              ) : (
                <ul>{seccion.lista.map((item) => <li key={item}><strong>{item.split('|')[0]}</strong>{item.split('|')[1]}</li>)}</ul>
              )
            )}
          </section>
        ))}

        <p className="blog-detalle-cierre">{articulo.cierre}</p>
      </article>
    </Container>
  );
}

export default BlogDetalle;
