// Simulador de pasarela de pago. No se conecta a ningún banco real:
// decide el resultado según el número de tarjeta para poder demostrar
// tanto el pago correcto como el pago con error.
//   - Tarjeta terminada en 0000 -> el "banco" la rechaza.
//   - Cualquier otra tarjeta de 16 dígitos -> pago aprobado.
export function procesarPago(numeroTarjeta) {
  const digitos = String(numeroTarjeta).replace(/\s/g, '');
  if (digitos.endsWith('0000')) {
    return { ok: false, mensaje: 'El banco rechazó la tarjeta.' };
  }
  return { ok: true, mensaje: 'Pago aprobado.' };
}