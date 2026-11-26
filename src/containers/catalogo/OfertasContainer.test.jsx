import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OfertasContainer from '@/containers/catalogo/OfertasContainer.jsx';

const catalogo = [
  { codigo: 'A1', categoria: 'Madera', nombre: 'Tabla en oferta', marca: 'X', unidad: 'U', precioVenta: 800, precioAnterior: 1000, enOferta: true, stock: 5, stockMinimo: 1 },
  { codigo: 'B1', categoria: 'Madera', nombre: 'Viga normal', marca: 'X', unidad: 'U', precioVenta: 2000, stock: 5, stockMinimo: 1 },
];

// Espera a que el catálogo llegue desde la API (el carrito exige sesión).
async function mostrar(productos, textoEsperado = 'Tabla en oferta') {
  localStorage.setItem('ep1-products', JSON.stringify(productos));
  localStorage.setItem('ep1-user', JSON.stringify({ run: '222222222', nombre: 'Ana', apellidos: 'Demo', correo: 'cliente@gmail.com', tipoUsuario: 'Cliente', activo: true }));
  render(
    <MemoryRouter>
      <OfertasContainer />
    </MemoryRouter>,
  );
  await screen.findByText(textoEsperado);
}

describe('OfertasContainer', () => {
  it('muestra solo los productos en oferta', async () => {
    await mostrar(catalogo);
    expect(screen.getByText('Tabla en oferta')).toBeInTheDocument();
    expect(screen.queryByText('Viga normal')).not.toBeInTheDocument();
  });

  it('agrega al carrito y muestra el aviso', async () => {
    await mostrar(catalogo);
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('muestra un mensaje si no hay ofertas', async () => {
    await mostrar([catalogo[1]], 'No hay ofertas por ahora');
    expect(screen.getByText('No hay ofertas por ahora')).toBeInTheDocument();
  });
});