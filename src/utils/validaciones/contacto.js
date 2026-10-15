// Validación del formulario de contacto.
// Portado desde js/validaciones/contacto.js del HTML5.
import { validarCorreo, validarTexto } from './comunes.js';

export function validarContacto(datos) {
  return {
    nombre: validarTexto(datos.nombre, 'El nombre', 100, true),
    correo: validarCorreo(datos.correo),
    comentario: validarTexto(datos.comentario, 'El comentario', 500, true),
  };
}
