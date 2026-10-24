// Estado de un pedido para el panel admin (RF-17 del ERS).
// Un pedido solo se registra cuando el pago simulado fue aprobado, así que
// por defecto queda "Pagado". Si el pedido trae un estado propio, se respeta.
export function estadoPedido(pedido) {
  const estado = pedido && typeof pedido.estado === 'string' ? pedido.estado.trim() : '';
  return estado || 'Pagado';
}