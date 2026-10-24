import { validarCategoria } from './categorias.js';

const existentes = ['Madera', 'Pinturas'];

describe('validarCategoria', () => {
  it('acepta un nombre válido', () => {
    expect(validarCategoria('Iluminación', existentes)).toBe('');
  });
  it('rechaza nombres muy cortos o muy largos', () => {
    expect(validarCategoria('ab', existentes)).toMatch(/al menos 3/);
    expect(validarCategoria('a'.repeat(31), existentes)).toMatch(/30 caracteres/);
  });
  it('rechaza caracteres no permitidos', () => {
    expect(validarCategoria('Luz<script>', existentes)).toMatch(/solo letras/i);
  });
  it('rechaza duplicados sin distinguir mayúsculas', () => {
    expect(validarCategoria('madera', existentes)).toMatch(/Ya existe/);
  });
  it('permite conservar el nombre original al renombrar', () => {
    expect(validarCategoria('Madera', existentes, 'Madera')).toBe('');
  });
  it('trata un valor vacío como muy corto', () => {
    expect(validarCategoria(undefined, existentes)).toMatch(/al menos 3/);
  });
});