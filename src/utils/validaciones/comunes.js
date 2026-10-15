// Reglas compartidas por todos los formularios del sitio.
// Portado desde js/validaciones/comunes.js del HTML5.
// Las reglas devuelven texto vacío cuando el valor es válido.
//
// No se portan establecerError/mostrarErrores/activarValidacion: en React
// los mensajes viven en el estado del componente (useState) y se muestran
// con <Form.Control.Feedback> de react-bootstrap; la validación en vivo se
// logra recalculando los errores en cada cambio del formulario.

export function validarCorreo(correo) {
  correo = correo.trim().toLowerCase();
  if (!correo) return 'El correo es obligatorio.';
  if (correo.length > 100) return 'El correo admite hasta 100 caracteres.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return 'Ingresa un correo válido.';
  const dominio = correo.split('@')[1];
  if (
    dominio !== 'duoc.cl' &&
    dominio !== 'profesor.duoc.cl' &&
    dominio !== 'gmail.com'
  ) {
    return 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.';
  }
  return '';
}

export function validarClave(clave) {
  if (clave.length < 4 || clave.length > 10)
    return 'La contraseña debe tener entre 4 y 10 caracteres.';
  return '';
}

export function validarTexto(valor, nombre, maximo, obligatorio) {
  if (obligatorio && !valor.trim()) return nombre + ' es obligatorio.';
  if (valor.trim().length > maximo)
    return nombre + ' admite hasta ' + maximo + ' caracteres.';
  return '';
}
