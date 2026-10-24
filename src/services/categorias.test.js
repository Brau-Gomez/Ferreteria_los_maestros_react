import { claveCategorias, guardarCategorias, obtenerCategorias } from './categorias.js';
import { categoriasProducto } from '../data/categorias.js';

describe('servicio de categorías', () => {
  beforeEach(() => localStorage.clear());

  it('la primera vez siembra la lista oficial y la guarda', () => {
    expect(obtenerCategorias()).toEqual(categoriasProducto);
    expect(JSON.parse(localStorage.getItem(claveCategorias))).toEqual(categoriasProducto);
  });

  it('después respeta lo guardado', () => {
    guardarCategorias(['Solo una']);
    expect(obtenerCategorias()).toEqual(['Solo una']);
  });

  it('guardarCategorias devuelve false si el almacenamiento falla', () => {
    const espia = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('lleno'); });
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(guardarCategorias(['X'])).toBe(false);
    espia.mockRestore();
    aviso.mockRestore();
  });
});