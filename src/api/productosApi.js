// API de productos y categorías
import apiClient from './apiClient.js';

export async function listarProductos(params = {}) {
  const allProducts = [];
  let page = 0;
  const size = 100;
  while (true) {
    // El backend desactiva (no borra) los productos eliminados: solo se listan los activos.
    const { data } = await apiClient.get('/products', { params: { soloActivas: true, ...params, page, size } });
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

// El backend identifica productos y categorías por su id (UUID); el panel
// trabaja con el código del producto y el nombre de la categoría.
async function idDeProducto(codigo) {
  const { data } = await apiClient.get(`/products/code/${encodeURIComponent(codigo)}`);
  return data.id;
}

async function categoriasActivas() {
  const { data } = await apiClient.get('/categories/activas');
  return Array.isArray(data) ? data : data?.content || [];
}

const nombreCategoria = (categoria) => (typeof categoria === 'string'
  ? categoria
  : categoria.name || categoria.nombre);

async function buscarCategoria(nombre) {
  const categoria = (await categoriasActivas()).find((item) => nombreCategoria(item) === nombre);
  if (!categoria) throw new Error(`La categoría "${nombre}" no existe.`);
  return categoria;
}

export async function crearProducto(producto) {
  const categoria = await buscarCategoria(producto.categoria);
  const { data } = await apiClient.post('/products', convertirProducto(producto, categoria.id));
  return normalizarProducto(data);
}

export async function actualizarProducto(codigo, producto) {
  const [id, categoria] = await Promise.all([idDeProducto(codigo), buscarCategoria(producto.categoria)]);
  const { data } = await apiClient.put(`/products/${id}`, convertirProducto(producto, categoria.id));
  return normalizarProducto(data);
}

export async function eliminarProducto(codigo) {
  const id = await idDeProducto(codigo);
  await apiClient.delete(`/products/${id}`);
}

export async function listarCategorias() {
  return (await categoriasActivas()).map(nombreCategoria);
}

export async function crearCategoria(categoria) {
  const { data } = await apiClient.post('/categories', { name: categoria.nombre, active: true });
  return data;
}

export async function actualizarCategoria(nombreAntiguo, nombreNuevo) {
  const categoria = await buscarCategoria(nombreAntiguo);
  const { data } = await apiClient.put(`/categories/${categoria.id}`, {
    name: nombreNuevo,
    description: categoria.description,
    imageUrl: categoria.imageUrl,
    sortOrder: categoria.sortOrder,
    active: true,
  });
  return data;
}

export async function eliminarCategoria(nombre) {
  const categoria = await buscarCategoria(nombre);
  await apiClient.delete(`/categories/${categoria.id}`);
}

// El backend guarda la referencia (URL) de la imagen, no el archivo: se registra
// la ruta del catálogo según el código, donde se publica la imagen del producto.
export async function subirImagen(codigo, archivo) {
  const id = await idDeProducto(codigo);
  const extension = String(archivo?.name || '').split('.').pop()?.toLowerCase() || 'svg';
  const url = `assets/img/productos/${String(codigo).toUpperCase()}.${extension}`;
  const { data } = await apiClient.post(`/products/${id}/images`, {
    url,
    altText: archivo?.name || codigo,
    primary: true,
  });
  return { ...data, url };
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

function convertirProducto(producto, categoryId) {
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
    categoryId: categoryId ?? producto.categoryId,
    active: producto.activo ?? true,
    featured: producto.enOferta ?? false,
  };
}