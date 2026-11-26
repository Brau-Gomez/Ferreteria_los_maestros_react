import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CheckoutContainer from '@/containers/checkout/CheckoutContainer.jsx';

const catalogo = [
  { codigo: 'MC001', nombre: 'Cemento gris 25 kg', marca: 'Polpaico', unidad: 'Saco', categoria: 'Materiales', precioVenta: 5990, stock: 80, stockMinimo: 20 },
];
const cliente = {
  run: '111111111',
  nombre: 'Ana',
  apellidos: 'Prueba Soto',
  correo: 'ana@gmail.com',
  tipoUsuario: 'Cliente',
  activo: true,
  direccion: 'Calle 1 #23',
  comuna: 'La Serena',
};

// Espera a que la sesión precargue el formulario y el carrito llegue de la API.
async function mostrar({ conCarrito = true } = {}) {
  localStorage.setItem('ep1-products', JSON.stringify(catalogo));
  localStorage.setItem('ep1-cart', JSON.stringify(conCarrito ? [{ codigo: 'MC001', cantidad: 2 }] : []));
  localStorage.setItem('ep1-users', JSON.stringify([cliente]));
  localStorage.setItem('ep1-user', JSON.stringify(cliente));
  render(
    <MemoryRouter>
      <CheckoutContainer />
    </MemoryRouter>,
  );
  if (conCarrito) {
    await screen.findByText('Resumen de compra');
    await screen.findByDisplayValue('Ana');
  }
}

function escribirTarjeta(numero) {
  fireEvent.change(screen.getByLabelText('Número de tarjeta *'), { target: { value: numero } });
}

const ordenesGuardadas = () => JSON.parse(localStorage.getItem('ep1-orders') || '[]');

describe('CheckoutContainer', () => {
  it('precarga los datos del usuario con sesión y muestra el resumen', async () => {
    await mostrar();
    expect(screen.getByLabelText('Nombre *')).toHaveValue('Ana');
    expect(screen.getByLabelText('Correo *')).toHaveValue('ana@gmail.com');
    expect((await screen.findAllByText('$11.980')).length).toBeGreaterThan(0);
  });

  it('muestra el carrito vacío si no hay productos', async () => {
    await mostrar({ conCarrito: false });
    expect(await screen.findByText('Tu carrito está vacío')).toBeInTheDocument();
  });

  it('muestra errores y no paga si la tarjeta falta', async () => {
    await mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }));
    expect(screen.getByText('El número de tarjeta es obligatorio.')).toBeInTheDocument();
    expect(ordenesGuardadas()).toHaveLength(0);
  });

  it('pide dirección y comuna solo con despacho', async () => {
    await mostrar();
    expect(screen.queryByLabelText('Dirección *')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Despacho'));
    expect(screen.getByLabelText('Dirección *')).toHaveValue('Calle 1 #23');
    expect(await screen.findByDisplayValue('La Serena')).toBeInTheDocument();
  });

  it('pago correcto: crea la orden con despacho, vacía el carrito y muestra el número', async () => {
    await mostrar();
    fireEvent.click(screen.getByLabelText('Despacho'));
    await screen.findByDisplayValue('La Serena');
    escribirTarjeta('4111 1111 1111 1111');
    fireEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }));

    expect(await screen.findByText('Pago realizado correctamente.')).toBeInTheDocument();
    const ordenes = ordenesGuardadas();
    expect(ordenes).toHaveLength(1);
    expect(ordenes[0].notes).toBe('Despacho');
    expect(ordenes[0].shippingAddress).toBe('Calle 1 #23');
    expect(ordenes[0].items).toEqual([expect.objectContaining({ productCode: 'MC001', quantity: 2 })]);
    expect(screen.getByText('Pedido ' + ordenes[0].id)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-cart'))).toEqual([]);
  });

  it('tarjeta rechazada: no crea la orden, conserva el carrito y permite reintentar', async () => {
    await mostrar();
    escribirTarjeta('4111 1111 1111 0000');
    fireEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }));

    expect(await screen.findByText('Pago con error')).toBeInTheDocument();
    expect(screen.getByText('El banco rechazó la tarjeta.')).toBeInTheDocument();
    expect(ordenesGuardadas()).toHaveLength(0);
    expect(JSON.parse(localStorage.getItem('ep1-cart'))).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Volver a realizar el pago' }));
    expect(screen.getByRole('button', { name: 'Pagar ahora' })).toBeInTheDocument();
    expect(screen.getByLabelText('Número de tarjeta *')).toHaveValue('');
  });
});
