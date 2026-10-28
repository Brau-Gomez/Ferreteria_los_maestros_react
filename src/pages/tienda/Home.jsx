// Portada del sitio: solo ordena sus secciones (hero, nosotros y blog).
// Los artículos viven en src/data/blog.js para no mezclar contenido con marcado.
import HeroPortada from '@/components/organisms/tienda/HeroPortada.jsx';
import SeccionBlog from '@/components/organisms/blog/SeccionBlog.jsx';
import SeccionNosotros from '@/components/organisms/tienda/SeccionNosotros.jsx';
import { articulosBlog } from '@/data/blog.js';

function Home() {
  return (
    <>
      <HeroPortada />
      <SeccionNosotros />
      <SeccionBlog articulos={articulosBlog} />
    </>
  );
}

export default Home;