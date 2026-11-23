// API de carrito
import apiClient from './apiClient.js';

export async function obtenerCarrito() {
  const { data } = await apiClient.get('/cart');
  const items = Array.isArray(data) ? data : data?.items || [];
  return items.map(normalizarItemCarrito);
}

export async function agregarAlCarrito(codigo, cantidad = 1) {
  const { data } = await apiClient.post('/cart/items', { code: codigo, quantity: cantidad });
  return normalizarItemCarrito(data);
}

export async function actualizarCantidadCarrito(codigo, cantidad) {
  const { data } = await apiClient.patch(`/cart/items/${encodeURIComponent(codigo)}`, { quantity: cantidad });
  return normalizarItemCarrito(data);
}

export async function quitarDelCarrito(codigo) {
  await apiClient.delete(`/cart/items/${encodeURIComponent(codigo)}`);
}

export async function vaciarCarrito() {
  await apiClient.delete('/cart');
}

function imagenPorCodigo(codigo) {
  if (!codigo) return '';
  // Los SVG se renombraron al código del producto; si no existe, el <img> cae al placeholder.
  return `assets/img/productos/${codigo.toUpperCase()}.svg`;
}

function normalizarItemCarrito(item) {
  if (!item) return item;
  const codigo = item.code ?? item.codigo;
  const backendImageUrl = item.imageUrl;
  // Use backend image URL only if it's an assets/ path; otherwise generate from code
  const imagen = backendImageUrl && backendImageUrl.startsWith('assets/')
    ? backendImageUrl
    : imagenPorCodigo(codigo);
  return {
    ...item,
    codigo,
    nombre: item.name ?? item.nombre,
    descripcion: item.description ?? item.descripcion,
    imagen,
    cantidad: item.quantity ?? item.cantidad,
    precioVenta: Number(item.unitPrice ?? item.precioVenta ?? 0),
    stock: item.stock ?? item.stockMinimo ?? 0,
    enOferta: item.featured ?? item.enOferta ?? false,
  };
}