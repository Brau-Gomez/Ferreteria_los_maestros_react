import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CategoriaDetalle from '@/pages/catalogo/CategoriaDetalle.jsx';

function mostrar(ruta) {
  // Categorías que entrega el backend (por ejemplo, una creada desde el panel).
  localStorage.setItem('ep1-categories', JSON.stringify(['Iluminación']));
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes><Route path="/categorias/:categoria" element={<CategoriaDetalle />} /></Routes>
    </MemoryRouter>,
  );
}

describe('CategoriaDetalle con categorías de la API', () => {
  it('reconoce una categoría creada por el admin', async () => {
    mostrar('/categorias/Iluminaci%C3%B3n');
    expect(await screen.findByRole('heading', { name: 'Iluminación' })).toBeInTheDocument();
  });

  it('una categoría eliminada muestra el aviso', async () => {
    mostrar('/categorias/Madera');
    expect(await screen.findByRole('heading', { name: 'Categoría no encontrada' })).toBeInTheDocument();
  });
});
