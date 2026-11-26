import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CarritoContainer from '@/containers/carrito/CarritoContainer.jsx';

const catalogo = [
  { codigo: 'MC001', nombre: 'Cemento gris 25 kg', marca: 'Polpaico', unidad: 'Saco', categoria: 'Materiales', precioVenta: 5990, stock: 80, stockMinimo: 20 },
];
const cliente = { run: '111111111', nombre: 'Ana', apellidos: 'Prueba', correo: 'ana@gmail.com', tipoUsuario: 'Cliente', activo: true };

// El carrito vive en el backend (cart-service) y exige sesión iniciada.
async function mostrar() {
  localStorage.setItem('ep1-products', JSON.stringify(catalogo));
  localStorage.setItem('ep1-cart', JSON.stringify([{ codigo: 'MC001', cantidad: 2 }]));
  localStorage.setItem('ep1-users', JSON.stringify([cliente]));
  localStorage.setItem('ep1-user', JSON.stringify(cliente));
  render(
    <MemoryRouter>
      <CarritoContainer />
    </MemoryRouter>,
  );
  await screen.findByText('Cemento gris 25 kg');
}

const cantidadGuardada = () => JSON.parse(localStorage.getItem('ep1-cart'))[0]?.cantidad;

describe('CarritoContainer', () => {
  it('muestra los productos del carrito y el total', async () => {
    await mostrar();
    expect(screen.getAllByText('$11.980').length).toBeGreaterThan(0);
  });

  it('recalcula el total al cambiar la cantidad y la guarda en el backend', async () => {
    await mostrar();
    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '3' } });
    expect((await screen.findAllByText('$17.970')).length).toBeGreaterThan(0);
    expect(cantidadGuardada()).toBe(3);
  });

  it('vacía el carrito al quitar el producto', async () => {
    await mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }));
    expect(await screen.findByText('Tu carrito está vacío')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-cart'))).toEqual([]);
  });

  it('ofrece ir a pagar cuando hay productos', async () => {
    await mostrar();
    expect(screen.getByRole('button', { name: 'Ir a pagar' })).toHaveAttribute('href', '/checkout');
  });
});
