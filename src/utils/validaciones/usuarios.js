// Validación de usuarios (registro, admin y cuenta).
// Portado desde js/validaciones/usuarios.js del HTML5.
// La función devuelve un objeto con un mensaje por cada campo con error;
// los campos válidos quedan con texto vacío.
import { normalizarRun, runValido } from '../run.js';
import { validarCorreo, validarTexto } from './comunes.js';
import { comunasPorRegion } from '../../data/regiones.js';

// - datos: campos del formulario.
// - usuarios: lista existente, para detectar duplicados.
// - runOriginal: RUN previo cuando se edita (ese usuario no cuenta como duplicado).
export function validarUsuario(datos, usuarios, runOriginal) {
  const errores = {};
  if (!runValido(datos.run))
    errores.run = 'Ingresa un RUN válido, entre 7 y 9 caracteres.';
  errores.nombre = validarTexto(datos.nombre, 'El nombre', 50, true);
  errores.apellidos = validarTexto(datos.apellidos, 'El apellido', 100, true);
  errores.correo = validarCorreo(datos.correo);
  errores.direccion = validarTexto(datos.direccion, 'La dirección', 300, true);
  const roles = ['Administrador', 'Vendedor', 'Cliente'];
  if (roles.indexOf(datos.tipoUsuario) === -1)
    errores.tipoUsuario = 'Selecciona un tipo de usuario.';
  const comunas = comunasPorRegion[datos.region];
  if (!comunas) errores.region = 'Selecciona una región.';
  if (!comunas || comunas.indexOf(datos.comuna) === -1)
    errores.comuna = 'Selecciona una comuna de la región.';
  if (datos.fechaNacimiento) {
    const fecha = new Date(datos.fechaNacimiento + 'T00:00:00');
    if (isNaN(fecha.getTime()) || fecha > new Date()) {
      errores.fechaNacimiento =
        'Ingresa una fecha de nacimiento válida, no futura.';
    }
  }
  for (let i = 0; i < usuarios.length; i++) {
    if (
      normalizarRun(usuarios[i].run) === datos.run &&
      datos.run !== runOriginal
    ) {
      errores.run = 'Ya existe un usuario registrado con este RUN.';
    }
    if (
      usuarios[i].correo.toLowerCase() === datos.correo &&
      normalizarRun(usuarios[i].run) !== runOriginal
    ) {
      errores.correo = 'Ya existe un usuario registrado con este correo.';
    }
  }
  return errores;
}
