import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ArticuloBlogDetalle from './ArticuloBlogDetalle.jsx';

const articulo = {
  categoria: 'Consejos', titulo: 'Cómo pintar', bajada: 'Bajada', imagen: '/x.png', detalleAlt: 'Foto',
  secciones: [
    { titulo: 'Pasos', parrafos: ['Intro'], lista: ['Lijar|: primero'], ordenada: true },
    { titulo: 'Materiales', lista: ['Rodillo|: grande'] },
  ],
  cierre: 'Fin',
};

describe('ArticuloBlogDetalle', () => {
  it('dibuja el artículo con listas ordenadas y sin ordenar', () => {
    const { container } = render(<MemoryRouter><ArticuloBlogDetalle articulo={articulo} /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: 'Cómo pintar' })).toBeInTheDocument();
    expect(container.querySelector('ol strong')).toHaveTextContent('Lijar');
    expect(container.querySelector('ul strong')).toHaveTextContent('Rodillo');
    expect(screen.getByText('Fin')).toBeInTheDocument();
  });
  it('sin artículo muestra el aviso', () => {
    render(<MemoryRouter><ArticuloBlogDetalle /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Artículo no encontrado' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver al blog' })).toHaveAttribute('href', '/#blog');
  });
});