// Validación del nombre de una categoría (formulario del admin).
// - existentes: categorías actuales, para detectar duplicados.
// - original: nombre previo cuando se renombra (se permite repetirlo).
export function validarCategoria(nombre, existentes, original = '') {
  const texto = String(nombre || '').trim();
  if (texto.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
  if (texto.length > 30) return 'El nombre no puede superar los 30 caracteres.';
  if (!/^[\p{L}\d .-]+$/u.test(texto)) {
    return 'Usa solo letras, números, espacios, puntos o guiones.';
  }
  const repetida = existentes.some(
    (categoria) => categoria !== original && categoria.toLowerCase() === texto.toLowerCase(),
  );
  if (repetida) return 'Ya existe una categoría con ese nombre.';
  return '';
}