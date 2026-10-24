import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BlogDetalleContainer from './BlogDetalleContainer.jsx';
import { articulosBlog } from '../data/blog.js';

function mostrar(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes><Route path="/blog/:slug" element={<BlogDetalleContainer />} /></Routes>
    </MemoryRouter>,
  );
}

describe('BlogDetalleContainer', () => {
  it('busca el artículo por slug y cambia el título de la pestaña', () => {
    const a = articulosBlog.find((x) => x.slug);
    const { unmount } = mostrar('/blog/' + a.slug);
    expect(screen.getByRole('heading', { level: 1, name: a.titulo })).toBeInTheDocument();
    expect(document.title).toBe(`${a.titulo} | Ferretería Los Maestros`);
    unmount();
    expect(document.title).not.toContain(a.titulo);
  });
  it('con slug desconocido muestra el aviso', () => {
    mostrar('/blog/no-existe');
    expect(screen.getByRole('heading', { name: 'Artículo no encontrado' })).toBeInTheDocument();
    expect(document.title).toBe('Artículo no encontrado | Ferretería Los Maestros');
  });
});