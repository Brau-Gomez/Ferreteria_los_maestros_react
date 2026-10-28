import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from '@/context/CartProvider.jsx';
import CategoriaDetalleContainer from '@/containers/catalogo/CategoriaDetalleContainer.jsx';

function mostrar(ruta) {
  localStorage.clear();
  localStorage.setItem('ep1-categories', JSON.stringify(['Pinturas']));
  localStorage.setItem('ep1-products', JSON.stringify([]));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <CartProvider>
        <Routes><Route path="/categorias/:categoria" element={<CategoriaDetalleContainer />} /></Routes>
      </CartProvider>
    </MemoryRouter>,
  );
}

describe('CategoriaDetalleContainer', () => {
  it('con categoría existente muestra su título', () => {
    mostrar('/categorias/Pinturas');
    expect(screen.getByRole('heading', { level: 1, name: 'Pinturas' })).toBeInTheDocument();
  });
  it('con categoría inexistente muestra el aviso', () => {
    mostrar('/categorias/Inventada');
    expect(screen.getByRole('heading', { name: 'Categoría no encontrada' })).toBeInTheDocument();
  });
});