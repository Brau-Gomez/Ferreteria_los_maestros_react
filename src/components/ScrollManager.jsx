// Gestión del scroll en la navegación (Fase 3).
// Reproduce el comportamiento de los enlaces ancla del HTML original:
// - Navegación normal: la página nueva arranca arriba.
// - Navegación con ancla (/#nosotros, /#blog): desplazamiento suave
//   hasta la sección, también cuando se llega desde otra página.
// La compensación de la cabecera fija la hace .seccion-ancla
// (scroll-margin-top) en theme.css, como el scroll-margin del original.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const destino = document.querySelector(hash);
      if (destino) destino.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default ScrollManager;
