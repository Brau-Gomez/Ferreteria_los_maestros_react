import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VistaCategoria from '@/components/organisms/catalogo/VistaCategoria.jsx';

describe('VistaCategoria', () => {
  it('si existe muestra título, migas y contenido', () => {
    render(<MemoryRouter><VistaCategoria categoria="Pinturas" existe><p>Catálogo</p></VistaCategoria></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Pinturas' })).toBeInTheDocument();
    expect(screen.getByText('Catálogo')).toBeInTheDocument();
  });
  it('si no existe muestra el aviso y no el contenido', () => {
    render(<MemoryRouter><VistaCategoria categoria="X" existe={false}><p>Catálogo</p></VistaCategoria></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Categoría no encontrada' })).toBeInTheDocument();
    expect(screen.queryByText('Catálogo')).not.toBeInTheDocument();
  });
});