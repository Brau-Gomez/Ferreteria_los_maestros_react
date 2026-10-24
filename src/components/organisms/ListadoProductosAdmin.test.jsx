import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListadoProductosAdmin from './ListadoProductosAdmin.jsx';

const productos = [
  { codigo: 'MC001', nombre: 'Cemento gris', categoria: 'Mat. Construcción', precioVenta: 5990, stock: 80, stockMinimo: 20 },
  { codigo: 'HE001', nombre: 'Taladro', categoria: 'Herramientas', precioVenta: 39990, stock: 1, stockMinimo: 2 },
];

const base = {
  kicker: 'Inventario',
  titulo: 'Productos',
  descripcion: 'Listado.',
  tituloPanel: 'Catálogo administrable',
  productos,
  esAdmin: true,
  mostrarNuevo: true,
  textoVacio: 'No hay productos.',
};

function mostrar(propiedades) {
  return render(
    <MemoryRouter>
      <ListadoProductosAdmin {...base} {...propiedades} />
    </MemoryRouter>,
  );
}

describe('ListadoProductosAdmin', () => {
  it('muestra una fila por producto con su estado de stock', () => {
    mostrar();
    expect(screen.getByText('Cemento gris')).toBeInTheDocument();
    expect(screen.getByText('Disponible')).toBeInTheDocument();
    expect(screen.getByText('Stock crítico')).toBeInTheDocument();
    expect(screen.getByText('$5.990')).toBeInTheDocument();
  });

  it('el administrador ve Nuevo producto y Editar', () => {
    mostrar();
    expect(screen.getByRole('button', { name: 'Nuevo producto' })).toHaveAttribute('href', '/admin/productos/nuevo');
    expect(screen.getAllByRole('link', { name: 'Editar' })).toHaveLength(2);
  });

  it('el vendedor solo ve el enlace Ver', () => {
    mostrar({ esAdmin: false });
    expect(screen.queryByRole('button', { name: 'Nuevo producto' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Editar' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Ver' })).toHaveLength(2);
  });

  it('muestra el texto vacío si no hay productos', () => {
    mostrar({ productos: [] });
    expect(screen.getByText('No hay productos.')).toBeInTheDocument();
  });
});