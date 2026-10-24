import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ScrollManager from './ScrollManager.jsx';

function montar(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <ScrollManager />
      <section id="blog">Blog</section>
    </MemoryRouter>,
  );
}

describe('ScrollManager', () => {
  beforeEach(() => {
    // jsdom no implementa estas funciones de scroll: se reemplazan por mocks.
    window.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('lleva la página arriba en una navegación normal', () => {
    montar('/productos');
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('se desplaza hasta la sección cuando la ruta trae un ancla', () => {
    montar('/#blog');
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});