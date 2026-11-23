// Cálculos de órdenes y boletas del panel admin.
import { marcaPedido } from './cuenta.js';

const TASA_IVA = 0.19;

// Los precios de venta incluyen IVA: se separa el neto y el IVA del total.
export function desgloseIva(total) {
  const bruto = Number(total) || 0;
  const neto = Math.round(bruto / (1 + TASA_IVA));
  return { neto, iva: bruto - neto, total: bruto };
}

// Pedidos del más nuevo al más antiguo (la fecha viaja en el id PED-<marca>).
export function ordenarPedidos(pedidos) {
  const marca = (pedido) => Date.parse(pedido?.createdAt) || marcaPedido(pedido?.id);
  return [...pedidos].sort((a, b) => marca(b) - marca(a));
}

export function buscarPedido(pedidos, id) {
  return pedidos.find((pedido) => pedido.id === id) || null;
}

// Nombre para mostrar del cliente de un pedido; si el perfil ya no existe
// se muestra su RUN.
export function nombreCliente(usuarios, identificador) {
  if (!identificador) return 'Cliente no registrado';
  // Los pedidos de la API traen userId (UUID); los antiguos traen run.
  const usuario = usuarios.find((item) => item.id === identificador || item.run === identificador);
  if (!usuario) return `Cliente no registrado (${identificador})`;
  return `${usuario.nombre} ${usuario.apellidos}`.trim();
}