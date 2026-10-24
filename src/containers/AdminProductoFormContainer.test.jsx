import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminProductoFormContainer from './AdminProductoFormContainer.jsx';

const existente = {
  codigo: 'MAD1', nombre: 'Tablón', descripcion: 'Pino', categoria: 'Madera',
  precioVenta: 5990, stock: 10, stockMinimo: 2, imagen: 'data:x', marca: 'Acme', unidad: 'U',
};

function mostrar(modo, ruta) {
  localStorage.clear();
  localStorage.setItem('ep1-products', JSON.stringify([existente]));
  localStorage.setItem('ep1-categories', JSON.stringify(['Madera', 'Jardín']));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/productos/nuevo" element={<AdminProductoFormContainer modo="nuevo" />} />
        <Route path="/admin/productos/:codigo/editar" element={<AdminProductoFormContainer modo="editar" />} />
        <Route path="/admin/productos/:codigo" element={<p>Detalle guardado</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

function llenarNuevo(codigo = 'nuevo1') {
  fireEvent.change(screen.getByLabelText('Código *'), { target: { value: codigo } });
  fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Pala' } });
  fireEvent.change(screen.getByLabelText('Precio de venta *'), { target: { value: '3000' } });
  fireEvent.change(screen.getByLabelText('Stock *'), { target: { value: '4' } });
  fireEvent.change(screen.getByLabelText('Categoría *'), { target: { value: 'Jardín' } });
}

describe('AdminProductoFormContainer', () => {
  it('muestra las categorías guardadas en el select', () => {
    mostrar('nuevo', '/admin/productos/nuevo');
    expect(screen.getByRole('option', { name: 'Jardín' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Pinturas' })).not.toBeInTheDocument();
  });

  it('crea un producto válido y va a su detalle', async () => {
    mostrar('nuevo', '/admin/productos/nuevo');
    llenarNuevo();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(await screen.findByText('Detalle guardado')).toBeInTheDocument();
    const guardados = JSON.parse(localStorage.getItem('ep1-products'));
    expect(guardados.map((p) => p.codigo)).toEqual(['MAD1', 'NUEVO1']);
    expect(guardados[1].precioVenta).toBe(3000);
  });

  it('muestra errores y no guarda si faltan datos', () => {
    mostrar('nuevo', '/admin/productos/nuevo');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(screen.getByText('El código debe tener al menos 3 caracteres.')).toBeInTheDocument();
    expect(screen.getByText('Selecciona una categoría.')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-products'))).toHaveLength(1);
  });

  it('rechaza un código repetido', () => {
    mostrar('nuevo', '/admin/productos/nuevo');
    llenarNuevo('mad1');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(screen.getByText('Ya existe un producto con este código.')).toBeInTheDocument();
  });

  it('rechaza una imagen que no es del tipo permitido', () => {
    mostrar('nuevo', '/admin/productos/nuevo');
    llenarNuevo();
    const pdf = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText('Imagen'), { target: { files: [pdf] } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(screen.getByText('Selecciona una imagen PNG, JPG, WebP o SVG.')).toBeInTheDocument();
  });

  it('en edición precarga los datos y guarda los cambios', async () => {
    mostrar('editar', '/admin/productos/MAD1/editar');
    expect(screen.getByLabelText('Nombre *')).toHaveValue('Tablón');
    fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Tablón grande' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('Detalle guardado')).toBeInTheDocument();
    const guardado = JSON.parse(localStorage.getItem('ep1-products'))[0];
    expect(guardado.nombre).toBe('Tablón grande');
    expect(guardado.marca).toBe('Acme');
  });

  it('avisa si el producto a editar no existe', () => {
    mostrar('editar', '/admin/productos/ZZZ/editar');
    expect(screen.getByRole('heading', { name: 'Producto no encontrado' })).toBeInTheDocument();
  });

  it('avisa si no se pudo guardar', async () => {
    mostrar('nuevo', '/admin/productos/nuevo');
    llenarNuevo();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('lleno'); });
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No fue posible guardar el producto');
    vi.restoreAllMocks();
  });
});