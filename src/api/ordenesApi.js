// API de órdenes
import apiClient from './apiClient.js';

export async function crearOrden(orden, idempotencyKey) {
  const despacho = orden.despacho;
  const payload = {
    items: orden.items.map((item) => ({
      productCode: item.codigo,
      quantity: item.cantidad,
    })),
    shippingAddress: despacho?.direccion || 'Retiro en tienda',
    shippingCommuneId: despacho?.comunaId ? String(despacho.comunaId) : '1',
    shippingRegionId: String(despacho?.regionId || 1),
    notes: orden.entrega,
  };
  const { data } = await apiClient.post('/orders', payload, {
    headers: { 'Idempotency-Key': idempotencyKey },
  });
  return normalizarOrden(data);
}

export async function listarOrdenes(params = {}) {
  const { data } = await apiClient.get('/orders', { params });
  const page = data?.content ? data : null;
  if (!page) return [];
  return page.content.map(normalizarOrden);
}

export async function obtenerOrden(id) {
  const { data } = await apiClient.get(`/orders/${encodeURIComponent(id)}`);
  return normalizarOrden(data);
}

export async function actualizarEstadoOrden(id, estado) {
  const { data } = await apiClient.patch(
    `/orders/${encodeURIComponent(id)}/status`,
    null,
    { params: { status: estado } },
  );
  return normalizarOrden(data);
}

function normalizarOrden(orden) {
  if (!orden) return orden;
  const items = (orden.items || []).map((item) => ({
    codigo: item.productCode ?? item.codigo,
    nombre: item.productName ?? item.nombre,
    cantidad: item.quantity ?? item.cantidad,
    precioUnitario: Number(item.unitPrice ?? item.precioUnitario ?? 0),
  }));
  return {
    ...orden,
    // El panel admin todavía lee el formato de los pedidos guardados en localStorage.
    runUsuario: orden.runUsuario ?? orden.userId,
    delivery: orden.delivery ?? orden.notes ?? orden.shippingAddress,
    estado: orden.status ?? orden.estado,
    total: Number(orden.total ?? 0),
    items,
    productos: orden.productos ?? items.map((item) => ({
      codigo: item.codigo,
      nombre: item.nombre,
      cantidad: item.cantidad,
      precioVenta: item.precioUnitario,
    })),
  };
}