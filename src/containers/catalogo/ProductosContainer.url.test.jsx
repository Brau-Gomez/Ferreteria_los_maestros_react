import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductosContainer from '@/containers/catalogo/ProductosContainer.jsx';

const catalogo = [
  { codigo: 'H1', nombre: 'Martillo carpintero', marca: 'Stanley', unidad: 'U', categoria: 'Herramientas', precioVenta: 8990, stock: 10, stockMinimo: 3 },
  { codigo: 'M1', nombre: 'Tabla de pino', marca: 'X', unidad: 'U', categoria: 'Madera', precioVenta: 1000, stock: 10, stockMinimo: 3 },
];

async function mostrar(ruta, propiedades, textoEsperado) {
  localStorage.setItem('ep1-products', JSON.stringify(catalogo));
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <ProductosContainer {...propiedades} />
    </MemoryRouter>,
  );
  await screen.findByText(textoEsperado);
}

describe('ProductosContainer: búsqueda por URL y categoría inicial', () => {
  it('aplica el texto de ?q= como filtro', async () => {
    await mostrar('/productos?q=martillo', {}, 'Martillo carpintero');
    expect(screen.getByLabelText('Buscar por nombre, marca o código')).toHaveValue('martillo');
    expect(screen.getByText('Martillo carpintero')).toBeInTheDocument();
    expect(screen.queryByText('Tabla de pino')).not.toBeInTheDocument();
  });

  it('usa la categoría inicial recibida', async () => {
    await mostrar('/categorias/Madera', { categoriaInicial: 'Madera' }, 'Tabla de pino');
    expect(await screen.findByDisplayValue('Madera')).toBeInTheDocument();
    expect(screen.queryByText('Martillo carpintero')).not.toBeInTheDocument();
  });
});