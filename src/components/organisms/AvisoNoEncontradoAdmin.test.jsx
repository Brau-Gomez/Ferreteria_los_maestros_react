import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AvisoNoEncontradoAdmin from './AvisoNoEncontradoAdmin.jsx';

describe('AvisoNoEncontradoAdmin', () => {
  it('muestra el título, el texto y el enlace de vuelta', () => {
    render(
      <MemoryRouter>
        <AvisoNoEncontradoAdmin titulo="Producto no encontrado" texto="No existe." ruta="/admin/productos" etiquetaRuta="Volver" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Producto no encontrado' })).toBeInTheDocument();
    expect(screen.getByText('No existe.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver' })).toHaveAttribute('href', '/admin/productos');
  });
});