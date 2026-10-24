import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TarjetaProducto from './TarjetaProducto.jsx';

const producto = { codigo: 'MC001', nombre: 'Cemento gris', marca: 'Polpaico', unidad: 'Saco', categoria: 'Mat. Construcción', precioVenta: 5990, stock: 10, stockMinimo: 2 };

function mostrar(datos, onAgregar = () => {}) {
  return render(
    <MemoryRouter>
      <TarjetaProducto producto={{ ...producto, ...datos }} onAgregar={onAgregar} />
    </MemoryRouter>,
  );
}

describe('TarjetaProducto', () => {
  it('muestra nombre, precio y stock', () => {
    mostrar();
    expect(screen.getByText('Cemento gris')).toBeInTheDocument();
    expect(screen.getByText('$5.990')).toBeInTheDocument();
    expect(screen.getByText('Stock disponible: 10')).toBeInTheDocument();
  });

  it('sin oferta no muestra la etiqueta de descuento', () => {
    mostrar();
    expect(screen.queryByText(/Oferta -/)).not.toBeInTheDocument();
  });

  it('en oferta muestra el descuento y el precio anterior tachado', () => {
    mostrar({ enOferta: true, precioAnterior: 7190 });
    expect(screen.getByText('Oferta -17%')).toBeInTheDocument();
    expect(screen.getByText('$7.190').tagName).toBe('DEL');
  });

  it('avisa el código al agregar', () => {
    const onAgregar = vi.fn();
    mostrar({}, onAgregar);
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(onAgregar).toHaveBeenCalledWith('MC001');
  });

  it('con stock 0 el botón Agregar queda deshabilitado', () => {
    mostrar({ stock: 0 });
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeDisabled();
    expect(screen.getByText('Sin stock disponible')).toBeInTheDocument();
  });
});