// Persistencia de las categorías del catálogo.
// La primera vez se siembra con la lista oficial (data/categorias.js);
// después el admin puede crear, renombrar y eliminar categorías.
import { categoriasProducto } from '../data/categorias.js';
import { guardarDato, leerListaGuardada } from './almacenamiento.js';

export const claveCategorias = 'ep1-categories';

export function obtenerCategorias() {
  const guardadas = leerListaGuardada(claveCategorias);
  if (guardadas !== null) return guardadas;
  const iniciales = categoriasProducto.slice();
  guardarDato(claveCategorias, iniciales);
  return iniciales;
}

export function guardarCategorias(lista) {
  return guardarDato(claveCategorias, lista);
}