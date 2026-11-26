// Estado de un pedido para el panel admin (RF-17 del ERS).
// Un pedido solo se registra cuando el pago simulado fue aprobado, así que
// por defecto queda "Pagado". El backend envía el estado en inglés.
const ESTADOS = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Pagado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

export function estadoPedido(pedido) {
  const estado = pedido && typeof pedido.estado === 'string' ? pedido.estado.trim() : '';
  return ESTADOS[estado.toUpperCase()] || estado || 'Pagado';
}
