import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider.jsx';
import { CartProvider } from '../context/CartProvider.jsx';
import CarritoContainer from './CarritoContainer.jsx';

const catalogo = [
  { codigo: 'MC001', nombre: 'Cemento gris 25 kg', marca: 'Polpaico', unidad: 'Saco', categoria: 'Materiales', precioVenta: 5990, stock: 80, stockMinimo: 20 },
];
const cliente = { run: '11111111-1', nombre: 'Ana Prueba', correo: 'ana@test.cl', rol: 'Cliente', activo: true };

function prepararDatos({ conSesion }) {
  localStorage.clear();
  localStorage.setItem('ep1-products', JSON.stringify(catalogo));
  localStorage.setItem('ep1-cart', JSON.stringify([{ ...catalogo[0], cantidad: 2 }]));
  localStorage.setItem('ep1-users', JSON.stringify([cliente]));
  if (conSesion) localStorage.setItem('ep1-user', JSON.stringify({ run: cliente.run }));
}

function mostrar() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <CarritoContainer />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('CarritoContainer', () => {
  it('muestra los productos del carrito y el total', () => {
    prepararDatos({ conSesion: true });
    mostrar();
    expect(screen.getByText('Cemento gris 25 kg')).toBeInTheDocument();
    expect(screen.getAllByText('$11.980').length).toBeGreaterThan(0);
  });

  it('recalcula el total al cambiar la cantidad', () => {
    prepararDatos({ conSesion: true });
    mostrar();
    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '3' } });
    expect(screen.getAllByText('$17.970').length).toBeGreaterThan(0);
  });

  it('vacía el carrito al quitar el producto', () => {
    prepararDatos({ conSesion: true });
    mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }));
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
  });

  it('pide iniciar sesión si se confirma sin usuario y conserva el carrito', () => {
    prepararDatos({ conSesion: false });
    mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
    expect(screen.getByText(/Inicia sesión antes de confirmar/)).toBeInTheDocument();
    expect(screen.getByText('Cemento gris 25 kg')).toBeInTheDocument();
  });

  it('confirma el pedido con sesión y lo guarda en ep1-orders', () => {
    prepararDatos({ conSesion: true });
    mostrar();
    fireEvent.click(screen.getByLabelText('Despacho'));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
    expect(screen.getByText('Pedido recibido')).toBeInTheDocument();
    const pedidos = JSON.parse(localStorage.getItem('ep1-orders'));
    expect(pedidos).toHaveLength(1);
    expect(pedidos[0].delivery).toBe('Despacho');
    expect(pedidos[0].total).toBe(11980);
  });
});