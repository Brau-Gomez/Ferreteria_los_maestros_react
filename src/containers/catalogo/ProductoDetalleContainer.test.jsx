import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import ProductoDetalleContainer from '@/containers/catalogo/ProductoDetalleContainer.jsx';

const catalogo = [
  { codigo: 'MC001', nombre: 'Cemento gris 25 kg', marca: 'Polpaico', unidad: 'Saco', categoria: 'Materiales', precioVenta: 5990, stock: 3, stockMinimo: 1 },
];

// Replica lo que hace la página: lee :codigo de la ruta y se lo pasa al container.
function Ruta() {
  const { codigo } = useParams();
  return <ProductoDetalleContainer key={codigo} codigo={codigo} />;
}

// Espera a que el producto (o el aviso) llegue desde la API.
async function mostrar(ruta, textoEsperado = 'Cemento gris 25 kg') {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/productos/:codigo" element={<Ruta />} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findAllByText(textoEsperado);
}

describe('ProductoDetalleContainer', () => {
  beforeEach(() => {
    localStorage.setItem('ep1-products', JSON.stringify(catalogo));
    // El carrito exige sesión iniciada.
    localStorage.setItem('ep1-user', JSON.stringify({ run: '222222222', nombre: 'Ana', apellidos: 'Demo', correo: 'cliente@gmail.com', tipoUsuario: 'Cliente', activo: true }));
  });

  it('muestra el producto que indica la URL', async () => {
    await mostrar('/productos/MC001');
    expect(screen.getByText('Cemento gris 25 kg')).toBeInTheDocument();
    expect(screen.getByText('Stock disponible: 3')).toBeInTheDocument();
  });

  it('encuentra el producto aunque el código venga en minúsculas', async () => {
    await mostrar('/productos/mc001');
    expect(screen.getByText('Cemento gris 25 kg')).toBeInTheDocument();
  });

  it('muestra "Producto no encontrado" si el código no existe', async () => {
    await mostrar('/productos/ZZZ999', 'Producto no encontrado');
    expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
  });

  it('agrega al carrito y muestra el aviso', async () => {
    await mostrar('/productos/MC001');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
    expect(await screen.findByText('Producto agregado al carrito.')).toBeInTheDocument();
  });

  it('bloquea la compra cuando todo el stock ya está en el carrito', async () => {
    localStorage.setItem('ep1-cart', JSON.stringify([{ codigo: 'MC001', cantidad: 3 }]));
    await mostrar('/productos/MC001');
    expect(await screen.findByRole('button', { name: 'Stock completo en el carrito' })).toBeDisabled();
  });

  it('pone el nombre del producto en el título de la pestaña', async () => {
    await mostrar('/productos/MC001');
    expect(document.title).toBe('Cemento gris 25 kg | Ferretería Los Maestros');
  });
});