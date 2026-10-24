// Portada del sitio: solo ordena sus secciones (hero, nosotros y blog).
// Los artículos viven en src/data/blog.js para no mezclar contenido con marcado.
import HeroPortada from '../components/organisms/HeroPortada.jsx';
import SeccionBlog from '../components/organisms/SeccionBlog.jsx';
import SeccionNosotros from '../components/organisms/SeccionNosotros.jsx';
import { articulosBlog } from '../data/blog.js';

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