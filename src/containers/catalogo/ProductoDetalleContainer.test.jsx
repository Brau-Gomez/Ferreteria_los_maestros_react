import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { CartProvider } from '@/context/CartProvider.jsx';
import ProductoDetalleContainer from '@/containers/catalogo/ProductoDetalleContainer.jsx';

const catalogo = [
  { codigo: 'MC001', nombre: 'Cemento gris 25 kg', marca: 'Polpaico', unidad: 'Saco', categoria: 'Materiales', precioVenta: 5990, stock: 3, stockMinimo: 1 },
];

// Replica lo que hace la página: lee :codigo de la ruta y se lo pasa al container.
function Ruta() {
  const { codigo } = useParams();
  return <ProductoDetalleContainer key={codigo} codigo={codigo} />;
}

function mostrar(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <CartProvider>
        <Routes>
          <Route path="/productos/:codigo" element={<Ruta />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>,
  );
}

describe('ProductoDetalleContainer', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('ep1-products', JSON.stringify(catalogo));
  });

  it('muestra el producto que indica la URL', () => {
    mostrar('/productos/MC001');
    expect(screen.getByText('Cemento gris 25 kg')).toBeInTheDocument();
    expect(screen.getByText('Stock disponible: 3')).toBeInTheDocument();
  });

  it('encuentra el producto aunque el código venga en minúsculas', () => {
    mostrar('/productos/mc001');
    expect(screen.getByText('Cemento gris 25 kg')).toBeInTheDocument();
  });

  it('muestra "Producto no encontrado" si el código no existe', () => {
    mostrar('/productos/ZZZ999');
    expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
  });

  it('agrega al carrito y muestra el aviso', () => {
    mostrar('/productos/MC001');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
    expect(screen.getByText('Producto agregado al carrito.')).toBeInTheDocument();
  });

  it('bloquea la compra cuando todo el stock ya está en el carrito', () => {
    localStorage.setItem('ep1-cart', JSON.stringify([{ ...catalogo[0], cantidad: 3 }]));
    mostrar('/productos/MC001');
    expect(screen.getByRole('button', { name: 'Stock completo en el carrito' })).toBeDisabled();
  });

  it('pone el nombre del producto en el título de la pestaña', () => {
    mostrar('/productos/MC001');
    expect(document.title).toBe('Cemento gris 25 kg | Ferretería Los Maestros');
  });
});