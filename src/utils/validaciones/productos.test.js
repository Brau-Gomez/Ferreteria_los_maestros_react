import { validarImagen, validarNumero, validarProducto } from './productos.js';

const productoValido = {
  codigo: 'MC001',
  nombre: 'Cemento gris 25 kg',
  descripcion: '',
  precio: '5990',
  stock: '80',
  stockCritico: '20',
  categoria: 'Herramientas',
};

describe('validarNumero', () => {
  it('acepta vacío solo si no es obligatorio', () => {
    expect(validarNumero('', false, false)).toBe('');
    expect(validarNumero('', true, false)).toBe('Este valor es obligatorio.');
  });

  it('rechaza números negativos o que no son números', () => {
    expect(validarNumero('-1', true, false)).toMatch(/número válido/);
    expect(validarNumero('abc', true, false)).toMatch(/número válido/);
  });

  it('exige entero cuando se pide', () => {
    expect(validarNumero('2.5', true, true)).toBe('Ingresa un número entero.');
    expect(validarNumero('2', true, true)).toBe('');
  });
});

describe('validarImagen', () => {
  it('no exige imagen', () => {
    expect(validarImagen(null)).toBe('');
  });

  it('rechaza tipos no permitidos y archivos de más de 500 KB', () => {
    expect(validarImagen({ type: 'image/gif', size: 100 })).toMatch(/PNG, JPG, WebP o SVG/);
    expect(validarImagen({ type: 'image/png', size: 600 * 1024 })).toMatch(/500 KB/);
    expect(validarImagen({ type: 'image/png', size: 1000 })).toBe('');
  });
});

describe('validarProducto', () => {
  it('un producto correcto no tiene errores', () => {
    const errores = validarProducto(productoValido, [], '', null);
    expect(Object.values(errores).every((mensaje) => mensaje === '')).toBe(true);
  });

  it('exige código de al menos 3 caracteres, precio y categoría válida', () => {
    const errores = validarProducto(
      { ...productoValido, codigo: 'AB', precio: '', categoria: 'Otra' },
      [],
      '',
      null,
    );
    expect(errores.codigo).toMatch(/al menos 3/);
    expect(errores.precio).toBe('Este valor es obligatorio.');
    expect(errores.categoria).toBe('Selecciona una categoría.');
  });

  it('detecta un código duplicado, salvo el del propio producto al editar', () => {
    const existentes = [{ codigo: 'MC001' }];
    expect(validarProducto(productoValido, existentes, '', null).codigo).toBe(
      'Ya existe un producto con este código.',
    );
    expect(validarProducto(productoValido, existentes, 'MC001', null).codigo).toBeUndefined();
  });
});