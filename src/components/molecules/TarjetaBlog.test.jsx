import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TarjetaBlog from './TarjetaBlog.jsx';

const base = { imagen: '/x.png', alt: 'Foto', categoria: 'Consejos', titulo: 'Cómo pintar', parrafos: ['Párrafo uno.'] };

function mostrar(articulo) {
  return render(<MemoryRouter><TarjetaBlog articulo={articulo} /></MemoryRouter>);
}

describe('TarjetaBlog', () => {
  it('muestra título, categoría, párrafos e imagen', () => {
    mostrar(base);
    expect(screen.getByRole('heading', { name: 'Cómo pintar' })).toBeInTheDocument();
    expect(screen.getByText('Consejos')).toBeInTheDocument();
    expect(screen.getByText('Párrafo uno.')).toBeInTheDocument();
    expect(screen.getByAltText('Foto')).toBeInTheDocument();
  });
  it('con slug enlaza al artículo completo', () => {
    mostrar({ ...base, slug: 'pintura' });
    expect(screen.getByRole('link', { name: /Leer más/ })).toHaveAttribute('href', '/blog/pintura');
  });
  it('sin slug no muestra enlace', () => {
    mostrar({ ...base, slug: null, destacado: true });
    expect(screen.queryByRole('link', { name: /Leer más/ })).not.toBeInTheDocument();
  });
});