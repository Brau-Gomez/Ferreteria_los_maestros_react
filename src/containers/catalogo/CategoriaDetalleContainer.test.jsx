import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CategoriaDetalleContainer from '@/containers/catalogo/CategoriaDetalleContainer.jsx';

function mostrar(ruta) {
  localStorage.setItem('ep1-categories', JSON.stringify(['Pinturas']));
  localStorage.setItem('ep1-products', JSON.stringify([]));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes><Route path="/categorias/:categoria" element={<CategoriaDetalleContainer />} /></Routes>
    </MemoryRouter>,
  );
}

describe('CategoriaDetalleContainer', () => {
  it('con categoría existente muestra su título', async () => {
    mostrar('/categorias/Pinturas');
    expect(await screen.findByRole('heading', { level: 1, name: 'Pinturas' })).toBeInTheDocument();
  });
  it('con categoría inexistente muestra el aviso', async () => {
    mostrar('/categorias/Inventada');
    expect(await screen.findByRole('heading', { name: 'Categoría no encontrada' })).toBeInTheDocument();
  });
});