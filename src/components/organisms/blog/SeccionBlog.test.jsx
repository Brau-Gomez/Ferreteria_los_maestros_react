import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SeccionBlog from '@/components/organisms/blog/SeccionBlog.jsx';

const articulos = [
  { slug: null, destacado: true, titulo: 'Destacado', categoria: 'A', imagen: '/a.png', alt: 'a', parrafos: ['p1'] },
  { slug: 'uno', titulo: 'Artículo uno', categoria: 'B', imagen: '/b.png', alt: 'b', parrafos: ['p2'] },
  { slug: 'dos', titulo: 'Artículo dos', categoria: 'C', imagen: '/c.png', alt: 'c', parrafos: ['p3'] },
];

describe('SeccionBlog', () => {
  it('muestra el destacado y los demás artículos', () => {
    const { container } = render(<MemoryRouter><SeccionBlog articulos={articulos} /></MemoryRouter>);
    expect(container.querySelector('#blog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Destacado' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Artículo uno' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Leer más/ })).toHaveLength(2);
  });
  it('funciona sin artículo destacado', () => {
    render(<MemoryRouter><SeccionBlog articulos={articulos.slice(1)} /></MemoryRouter>);
    expect(screen.queryByRole('heading', { name: 'Destacado' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Artículo dos' })).toBeInTheDocument();
  });
});