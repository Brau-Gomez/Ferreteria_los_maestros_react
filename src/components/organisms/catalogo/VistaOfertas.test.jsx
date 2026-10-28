import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VistaOfertas from '@/components/organisms/catalogo/VistaOfertas.jsx';

const productos = [
  { codigo: 'A1', categoria: 'Madera', nombre: 'Tabla en oferta', marca: 'X', unidad: 'U', precioVenta: 800, precioAnterior: 1000, enOferta: true, stock: 5, stockMinimo: 1 },
];

function mostrar(propiedades) {
  return render(
    <MemoryRouter>
      <VistaOfertas productos={productos} aviso={null} onAgregar={() => {}} onCerrarAviso={() => {}} {...propiedades} />
    </MemoryRouter>,
  );
}

describe('VistaOfertas', () => {
  it('muestra el estado vacío sin productos', () => {
    mostrar({ productos: [] });
    expect(screen.getByText('No hay ofertas por ahora')).toBeInTheDocument();
  });

  it('muestra el aviso y permite cerrarlo', () => {
    const onCerrarAviso = vi.fn();
    mostrar({ aviso: { ok: true, mensaje: 'Producto agregado.' }, onCerrarAviso });
    expect(screen.getByText('Producto agregado.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onCerrarAviso).toHaveBeenCalledTimes(1);
  });
});