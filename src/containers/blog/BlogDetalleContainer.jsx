// Contenedor del artículo del blog: busca el artículo por slug y actualiza
// el título de la pestaña (efecto); el organismo solo lo dibuja.
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArticuloBlogDetalle from '@/components/organisms/blog/ArticuloBlogDetalle.jsx';
import { articulosBlog } from '@/data/blog.js';

function BlogDetalleContainer() {
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

  return <ArticuloBlogDetalle articulo={articulo} />;
}

export default BlogDetalleContainer;