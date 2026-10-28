// Prueba con MOCK: se reemplaza la pasarela de pago para controlar su
// respuesta y verificar cómo reacciona el container, sin depender de la
// regla de la tarjeta.
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider.jsx';
import { CartProvider } from '@/context/CartProvider.jsx';
import { procesarPago } from '@/utils/pago.js';
import CheckoutContainer from '@/containers/checkout/CheckoutContainer.jsx';

vi.mock('@/utils/pago.js', () => ({ procesarPago: vi.fn() }));

const producto = { codigo: 'MC001', nombre: 'Cemento gris 25 kg', marca: 'Polpaico', unidad: 'Saco', categoria: 'Materiales', precioVenta: 5990, stock: 80, stockMinimo: 20 };

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('ep1-products', JSON.stringify([producto]));
  localStorage.setItem('ep1-cart', JSON.stringify([{ ...producto, cantidad: 1 }]));
  localStorage.setItem('ep1-users', JSON.stringify([{ run: '11111111-1', nombre: 'Ana', apellidos: 'Soto', correo: 'ana@gmail.com', rol: 'Cliente', activo: true }]));
  localStorage.setItem('ep1-user', JSON.stringify({ run: '11111111-1' }));
  procesarPago.mockReset();
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <CheckoutContainer />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
  fireEvent.change(screen.getByLabelText('Número de tarjeta *'), { target: { value: '4111111111111111' } });
});

describe('CheckoutContainer con la pasarela simulada (mock)', () => {
  it('envía el número de tarjeta a la pasarela y confirma si responde ok', () => {
    procesarPago.mockReturnValue({ ok: true, mensaje: 'Pago aprobado.' });
    fireEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }));
    expect(procesarPago).toHaveBeenCalledWith('4111111111111111');
    expect(screen.getByText('Pago realizado correctamente.')).toBeInTheDocument();
  });

  it('muestra el motivo que entrega la pasarela cuando rechaza', () => {
    procesarPago.mockReturnValue({ ok: false, mensaje: 'Fondos insuficientes.' });
    fireEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }));
    expect(screen.getByText('Fondos insuficientes.')).toBeInTheDocument();
    expect(localStorage.getItem('ep1-orders')).toBeNull();
  });
});
