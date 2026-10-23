import {
  clavesDatos,
  eliminarRegistro,
  guardarDato,
  guardarRegistro,
  leerDatoGuardado,
  leerListaGuardada,
  normalizarProducto,
  obtenerProductos,
  obtenerUsuarios,
} from './almacenamiento.js';

describe('almacenamiento (localStorage)', () => {
  beforeEach(() => {
    localStorage.clear();
    // Los fallos esperados escriben advertencias en consola: se silencian
    // con un mock para no ensuciar la salida de las pruebas.
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('guarda y lee un dato como JSON', () => {
    expect(guardarDato('prueba', { a: 1 })).toBe(true);
    expect(leerDatoGuardado('prueba', null)).toEqual({ a: 1 });
  });

  it('devuelve el valor inicial si la clave no existe', () => {
    expect(leerDatoGuardado('no-existe', 'inicial')).toBe('inicial');
  });

  it('devuelve el valor inicial si el JSON guardado está dañado', () => {
    localStorage.setItem('roto', '{no es json');
    expect(leerDatoGuardado('roto', 'inicial')).toBe('inicial');
    expect(console.warn).toHaveBeenCalled();
  });

  it('leerListaGuardada solo acepta arreglos', () => {
    localStorage.setItem('objeto', JSON.stringify({ a: 1 }));
    localStorage.setItem('lista', JSON.stringify([1, 2]));
    expect(leerListaGuardada('objeto')).toBeNull();
    expect(leerListaGuardada('lista')).toEqual([1, 2]);
  });

  it('guardarDato devuelve false si localStorage falla (mock de setItem)', () => {
    // Mock: simula un navegador sin espacio o con el almacenamiento bloqueado.
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('cuota excedida');
    });
    expect(guardarDato('prueba', 1)).toBe(false);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('siembra los tres usuarios demo la primera vez', () => {
    const usuarios = obtenerUsuarios();
    expect(usuarios.map((u) => u.tipoUsuario)).toEqual(['Administrador', 'Vendedor', 'Cliente']);
    expect(JSON.parse(localStorage.getItem(clavesDatos.usuarios))).toHaveLength(3);
  });

  it('respeta los usuarios ya guardados en vez de sembrar de nuevo', () => {
    localStorage.setItem(clavesDatos.usuarios, JSON.stringify([]));
    expect(obtenerUsuarios()).toEqual([]);
  });

  it('siembra el catálogo desde el JSON y lo deja guardado', () => {
    const productos = obtenerProductos();
    expect(productos.length).toBeGreaterThan(0);
    expect(JSON.parse(localStorage.getItem(clavesDatos.productos))).toHaveLength(productos.length);
  });

  it('normalizarProducto limpia el código y entrega valores numéricos', () => {
    const producto = normalizarProducto({ codigo: ' mc001 ', nombre: ' Cemento ', precioVenta: '5990', stock: 'x' });
    expect(producto.codigo).toBe('MC001');
    expect(producto.nombre).toBe('Cemento');
    expect(producto.precioVenta).toBe(5990);
    expect(producto.stock).toBe(0);
    expect(producto.imagen).toBe('assets/img/productos/MC001.svg');
  });

  it('guardarRegistro agrega un registro nuevo y edita uno existente', () => {
    const lista = [{ run: '1', nombre: 'Ana' }];
    expect(guardarRegistro('usuarios', lista, 'run', '', { run: '2', nombre: 'Luis' })).toBe(true);
    expect(JSON.parse(localStorage.getItem('usuarios'))).toHaveLength(2);
    expect(guardarRegistro('usuarios', lista, 'run', '1', { run: '1', nombre: 'Ana María' })).toBe(true);
    expect(JSON.parse(localStorage.getItem('usuarios'))[0].nombre).toBe('Ana María');
  });

  it('guardarRegistro devuelve false si el registro a editar no existe', () => {
    expect(guardarRegistro('usuarios', [], 'run', '9', { run: '9' })).toBe(false);
  });

  it('eliminarRegistro quita el registro y avisa si no existe', () => {
    const lista = [{ run: '1' }, { run: '2' }];
    expect(eliminarRegistro('usuarios', lista, 'run', '1')).toBe(true);
    expect(JSON.parse(localStorage.getItem('usuarios'))).toEqual([{ run: '2' }]);
    expect(eliminarRegistro('usuarios', lista, 'run', '99')).toBe(false);
  });
});