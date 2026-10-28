import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FichaProducto from '@/components/organisms/catalogo/FichaProducto.jsx';

const producto = {
  codigo: 'MC001',
  nombre: 'Cemento gris 25 kg',
  marca: 'Polpaico',
  unidad: 'Saco',
  categoria: 'Materiales',
  precioVenta: 5990,
  stock: 80,
};

const base = {
  producto,
  cantidad: 2,
  tope: 10,
  sinStock: false,
  aviso: null,
  onCambiarCantidad: () => {},
  onAgregar: () => {},
  onCerrarAviso: () => {},
};

function mostrar(propiedades) {
  return render(
    <MemoryRouter>
      <FichaProducto {...base} {...propiedades} />
    </MemoryRouter>,
  );
}

describe('FichaProducto', () => {
  it('muestra los datos del producto', () => {
    mostrar();
    expect(screen.getByText('Cemento gris 25 kg')).toBeInTheDocument();
    expect(screen.getByText('Materiales')).toBeInTheDocument();
    expect(screen.getByText('$5.990')).toBeInTheDocument();
    expect(screen.getByText('Stock disponible: 80')).toBeInTheDocument();
    expect(screen.getByText('Sin descripción adicional.')).toBeInTheDocument();
  });

  it('avisa al presionar "Agregar al carrito"', () => {
    const onAgregar = vi.fn();
    mostrar({ onAgregar });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
    expect(onAgregar).toHaveBeenCalledTimes(1);
  });

  it('avisa la nueva cantidad al usar el selector', () => {
    const onCambiarCantidad = vi.fn();
    mostrar({ onCambiarCantidad });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar una unidad' }));
    expect(onCambiarCantidad).toHaveBeenCalledWith(3);
  });

  it('deshabilita la compra cuando el stock ya está en el carrito', () => {
    mostrar({ sinStock: true });
    expect(screen.getByRole('button', { name: 'Stock completo en el carrito' })).toBeDisabled();
  });

  it('muestra el aviso y permite cerrarlo', () => {
    const onCerrarAviso = vi.fn();
    mostrar({ aviso: { ok: true, mensaje: 'Producto agregado al carrito.' }, onCerrarAviso });
    expect(screen.getByText('Producto agregado al carrito.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onCerrarAviso).toHaveBeenCalledTimes(1);
  });
});