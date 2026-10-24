// Validación del formulario de checkout (datos del cliente, despacho y pago).
import { validarCorreo, validarTexto } from './comunes.js';

export function validarTarjeta(numero) {
  const digitos = numero.replace(/\s/g, '');
  if (!digitos) return 'El número de tarjeta es obligatorio.';
  if (!/^\d{16}$/.test(digitos)) return 'La tarjeta debe tener 16 dígitos.';
  return '';
}

// La dirección y la comuna solo se exigen cuando la entrega es "Despacho".
export function validarCheckout(datos) {
  const conDespacho = datos.entrega === 'Despacho';
  return {
    nombre: validarTexto(datos.nombre, 'El nombre', 50, true),
    apellidos: validarTexto(datos.apellidos, 'Los apellidos', 100, true),
    correo: validarCorreo(datos.correo),
    direccion: conDespacho ? validarTexto(datos.direccion, 'La dirección', 300, true) : '',
    comuna: conDespacho && !datos.comuna ? 'Selecciona una comuna.' : '',
    tarjeta: validarTarjeta(datos.tarjeta),
  };
}

export function hayErrores(errores) {
  return Object.values(errores).some(Boolean);
}