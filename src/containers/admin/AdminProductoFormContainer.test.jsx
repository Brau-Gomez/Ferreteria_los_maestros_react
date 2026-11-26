import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminProductoFormContainer from '@/containers/admin/AdminProductoFormContainer.jsx';
import { fallarSiguientePeticion } from '@/test/servidorFalso.js';

const existente = {
  codigo: 'MAD1', nombre: 'Tablón', descripcion: 'Pino', categoria: 'Madera',
  precioVenta: 5990, stock: 10, stockMinimo: 2, marca: 'Acme', unidad: 'U',
  enOferta: true, precioAnterior: 6990,
};

// Prepara el backend falso y espera a que el formulario tenga los datos de la API.
async function mostrar(ruta, { esperarFormulario = true } = {}) {
  localStorage.setItem('ep1-products', JSON.stringify([existente]));
  localStorage.setItem('ep1-categories', JSON.stringify(['Madera', 'Jardín']));
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/productos/nuevo" element={<AdminProductoFormContainer modo="nuevo" />} />
        <Route path="/admin/productos/:codigo/editar" element={<AdminProductoFormContainer modo="editar" />} />
        <Route path="/admin/productos/:codigo" element={<p>Detalle guardado</p>} />
      </Routes>
    </MemoryRouter>,
  );
  if (esperarFormulario) await screen.findByRole('option', { name: 'Jardín' });
}

function llenarNuevo(codigo = 'nuevo1') {
  fireEvent.change(screen.getByLabelText('Código *'), { target: { value: codigo } });
  fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Pala' } });
  fireEvent.change(screen.getByLabelText('Precio de venta *'), { target: { value: '3000' } });
  fireEvent.change(screen.getByLabelText('Stock *'), { target: { value: '4' } });
  fireEvent.change(screen.getByLabelText('Categoría *'), { target: { value: 'Jardín' } });
}

const productosGuardados = () => JSON.parse(localStorage.getItem('ep1-products'));

describe('AdminProductoFormContainer', () => {
  afterEach(() => vi.restoreAllMocks());

  it('muestra las categorías de la API en el select', async () => {
    await mostrar('/admin/productos/nuevo');
    expect(screen.getByRole('option', { name: 'Jardín' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Pinturas' })).not.toBeInTheDocument();
  });

  it('crea un producto válido con su categoría y va a su detalle', async () => {
    await mostrar('/admin/productos/nuevo');
    llenarNuevo();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(await screen.findByText('Detalle guardado')).toBeInTheDocument();
    const guardados = productosGuardados();
    expect(guardados.map((p) => p.codigo)).toEqual(['MAD1', 'NUEVO1']);
    expect(guardados[1].precioVenta).toBe(3000);
    expect(guardados[1].categoria).toBe('Jardín');
  });

  it('muestra errores y no guarda si faltan datos', async () => {
    await mostrar('/admin/productos/nuevo');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(screen.getByText('El código debe tener al menos 3 caracteres.')).toBeInTheDocument();
    expect(screen.getByText('Selecciona una categoría.')).toBeInTheDocument();
    expect(productosGuardados()).toHaveLength(1);
  });

  it('rechaza un código repetido', async () => {
    await mostrar('/admin/productos/nuevo');
    llenarNuevo('mad1');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(screen.getByText('Ya existe un producto con este código.')).toBeInTheDocument();
  });

  it('rechaza una imagen que no es del tipo permitido', async () => {
    await mostrar('/admin/productos/nuevo');
    llenarNuevo();
    const pdf = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText('Imagen'), { target: { files: [pdf] } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(screen.getByText('Selecciona una imagen PNG, JPG, WebP o SVG.')).toBeInTheDocument();
  });

  it('en edición precarga los datos y guarda sin perder la oferta', async () => {
    await mostrar('/admin/productos/MAD1/editar');
    expect(await screen.findByDisplayValue('Tablón')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Tablón grande' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(await screen.findByText('Detalle guardado')).toBeInTheDocument();
    const guardado = productosGuardados()[0];
    expect(guardado.nombre).toBe('Tablón grande');
    expect(guardado.categoria).toBe('Madera');
    expect(guardado.enOferta).toBe(true);
    expect(guardado.precioAnterior).toBe(6990);
  });

  it('avisa si el producto a editar no existe', async () => {
    await mostrar('/admin/productos/ZZZ/editar', { esperarFormulario: false });
    expect(await screen.findByRole('heading', { name: 'Producto no encontrado' })).toBeInTheDocument();
  });

  it('avisa si el servidor no pudo guardar', async () => {
    await mostrar('/admin/productos/nuevo');
    llenarNuevo();
    fallarSiguientePeticion(500, 'No fue posible guardar el producto.');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No fue posible guardar el producto');
    expect(productosGuardados()).toHaveLength(1);
  });
});
