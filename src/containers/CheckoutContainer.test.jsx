import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider.jsx';
import { CartProvider } from '../context/CartProvider.jsx';
import CheckoutContainer from './CheckoutContainer.jsx';

const catalogo = [
  { codigo: 'MC001', nombre: 'Cemento gris 25 kg', marca: 'Polpaico', unidad: 'Saco', categoria: 'Materiales', precioVenta: 5990, stock: 80, stockMinimo: 20 },
];
const cliente = {
  run: '11111111-1',
  nombre: 'Ana',
  apellidos: 'Prueba Soto',
  correo: 'ana@gmail.com',
  rol: 'Cliente',
  activo: true,
  direccion: 'Calle 1 #23',
  comuna: 'La Serena',
};

function mostrar({ conCarrito = true } = {}) {
  localStorage.clear();
  localStorage.setItem('ep1-products', JSON.stringify(catalogo));
  localStorage.setItem('ep1-cart', JSON.stringify(conCarrito ? [{ ...catalogo[0], cantidad: 2 }] : []));
  localStorage.setItem('ep1-users', JSON.stringify([cliente]));
  localStorage.setItem('ep1-user', JSON.stringify({ run: cliente.run }));
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <CheckoutContainer />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

function escribirTarjeta(numero) {
  fireEvent.change(screen.getByLabelText('Número de tarjeta *'), { target: { value: numero } });
}

describe('CheckoutContainer', () => {
  it('precarga los datos del usuario con sesión y muestra el resumen', () => {
    mostrar();
    expect(screen.getByLabelText('Nombre *')).toHaveValue('Ana');
    expect(screen.getByLabelText('Correo *')).toHaveValue('ana@gmail.com');
    expect(screen.getByText('Resumen de compra')).toBeInTheDocument();
    expect(screen.getAllByText('$11.980').length).toBeGreaterThan(0);
  });

  it('muestra el carrito vacío si no hay productos', () => {
    mostrar({ conCarrito: false });
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
  });

  it('muestra errores y no paga si la tarjeta falta', () => {
    mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }));
    expect(screen.getByText('El número de tarjeta es obligatorio.')).toBeInTheDocument();
    expect(localStorage.getItem('ep1-orders')).toBeNull();
  });

  it('pide dirección y comuna solo con despacho', () => {
    mostrar();
    expect(screen.queryByLabelText('Dirección *')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Despacho'));
    expect(screen.getByLabelText('Dirección *')).toHaveValue('Calle 1 #23');
    expect(screen.getByLabelText('Comuna *')).toHaveValue('La Serena');
  });

  it('pago correcto: guarda el pedido con despacho, vacía el carrito y muestra el número', () => {
    mostrar();
    fireEvent.click(screen.getByLabelText('Despacho'));
    escribirTarjeta('4111 1111 1111 1111');
    fireEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }));

    expect(screen.getByText('Pago realizado correctamente.')).toBeInTheDocument();
    const pedidos = JSON.parse(localStorage.getItem('ep1-orders'));
    expect(pedidos).toHaveLength(1);
    expect(pedidos[0].delivery).toBe('Despacho');
    expect(pedidos[0].despacho).toEqual({ direccion: 'Calle 1 #23', comuna: 'La Serena', region: 'Región de Coquimbo' });
    expect(screen.getByText('Pedido ' + pedidos[0].id)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-cart'))).toEqual([]);
  });

  it('pago con error: conserva el carrito y permite volver a pagar', () => {
    mostrar();
    escribirTarjeta('4111 1111 1111 0000');
    fireEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }));

    expect(screen.getByText('Pago con error')).toBeInTheDocument();
    expect(screen.getByText('El banco rechazó la tarjeta.')).toBeInTheDocument();
    expect(localStorage.getItem('ep1-orders')).toBeNull();
    expect(JSON.parse(localStorage.getItem('ep1-cart'))).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Volver a realizar el pago' }));
    expect(screen.getByRole('button', { name: 'Pagar ahora' })).toBeInTheDocument();
    expect(screen.getByLabelText('Número de tarjeta *')).toHaveValue('');
  });
});