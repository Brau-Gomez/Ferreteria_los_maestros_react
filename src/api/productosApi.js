// API de productos y categorías
import apiClient from './apiClient.js';

export async function listarProductos(params = {}) {
  const allProducts = [];
  let page = 0;
  const size = 100;
  while (true) {
    const { data } = await apiClient.get('/products', { params: { ...params, page, size } });
    const pageData = data?.content ? data : null;
    if (!pageData || pageData.content.length === 0) break;
    allProducts.push(...pageData.content.map(normalizarProducto));
    if (pageData.last) break;
    page++;
  }
  return allProducts;
}

export async function obtenerProducto(codigo) {
  const { data } = await apiClient.get(`/products/code/${encodeURIComponent(codigo)}`);
  return normalizarProducto(data);
}

export async function crearProducto(producto) {
  const { data } = await apiClient.post('/products', convertirProducto(producto));
  return normalizarProducto(data);
}

export async function actualizarProducto(codigo, producto) {
  const { data } = await apiClient.patch(`/products/code/${encodeURIComponent(codigo)}`, convertirProducto(producto));
  return normalizarProducto(data);
}

export async function eliminarProducto(codigo) {
  await apiClient.delete(`/products/code/${encodeURIComponent(codigo)}`);
}

export async function listarCategorias() {
  const { data } = await apiClient.get('/categories/activas');
  const categorias = Array.isArray(data) ? data : data?.content || [];
  return categorias.map((categoria) => typeof categoria === 'string'
    ? categoria
    : categoria.name || categoria.nombre);
}

export async function crearCategoria(categoria) {
  const { data } = await apiClient.post('/categorias', categoria);
  return data;
}

export async function actualizarCategoria(nombreAntiguo, nombreNuevo) {
  const { data } = await apiClient.patch(`/categorias/${encodeURIComponent(nombreAntiguo)}`, { nombre: nombreNuevo });
  return data;
}

export async function eliminarCategoria(nombre) {
  await apiClient.delete(`/categorias/${encodeURIComponent(nombre)}`);
}

export async function subirImagen(codigo, archivo) {
  const formData = new FormData();
  formData.append('file', archivo);
  const { data } = await apiClient.post(`/products/code/${encodeURIComponent(codigo)}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

function imagenPorCodigo(codigo) {
  if (!codigo) return '';
  // Los SVG se renombraron al código del producto; si no existe, el <img> cae al placeholder.
  return `assets/img/productos/${codigo.toUpperCase()}.svg`;
}

export function normalizarProducto(producto) {
  if (!producto) return producto;
  const precio = Number(producto.price ?? producto.precioVenta ?? 0);
  const precioAnterior = producto.compareAtPrice != null
    ? Number(producto.compareAtPrice)
    : Number(producto.precioAnterior ?? 0);
  const codigo = producto.code ?? producto.codigo;
  return {
    ...producto,
    codigo,
    nombre: producto.name ?? producto.nombre,
    descripcion: producto.description ?? producto.descripcion,
    precioVenta: precio,
    precioAnterior,
    stockMinimo: producto.minStock ?? producto.stockMinimo ?? 0,
    categoria: producto.category?.name ?? producto.category?.nombre ?? producto.categoria ?? '',
    enOferta: producto.featured ?? producto.enOferta ?? false,
    imagen: imagenPorCodigo(codigo),
  };
}

function convertirProducto(producto) {
  return {
    code: producto.codigo,
    name: producto.nombre,
    description: producto.descripcion || '',
    price: producto.precioVenta,
    compareAtPrice: producto.precioAnterior || null,
    costPrice: producto.costo || null,
    stock: producto.stock ?? 0,
    minStock: producto.stockMinimo ?? 0,
    maxStock: producto.stockMaximo || null,
    weightKg: producto.pesoKg || null,
    categoryId: producto.categoryId,
    active: producto.activo ?? true,
    featured: producto.enOferta ?? false,
  };
}