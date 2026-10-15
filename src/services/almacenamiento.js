// Capa de persistencia del proyecto.
// Portado desde js/compartido/almacenamiento.js del HTML5.
//
// Se conservan las mismas claves de localStorage y las mismas estructuras
// de datos, para que el sitio HTML original y esta versión React puedan
// convivir en el mismo navegador compartiendo catálogo, usuarios, carrito,
// pedidos y sesión.
import productosSemilla from '../data/productos.json';

// Claves exactas del proyecto original.
export const clavesDatos = {
  productos: 'ep1-products',
  usuarios: 'ep1-users',
  carrito: 'ep1-cart',
  pedidos: 'ep1-orders',
  abonos: 'ep1-payments',
  sesion: 'ep1-user',
};

export function leerDatoGuardado(clave, valorInicial) {
  try {
    const texto = localStorage.getItem(clave);
    if (texto === null) return valorInicial;
    return JSON.parse(texto);
  } catch (error) {
    console.warn('No se pudo leer ' + clave, error);
    return valorInicial;
  }
}

export function leerListaGuardada(clave) {
  const lista = leerDatoGuardado(clave, null);
  if (!Array.isArray(lista)) return null;
  return lista;
}

export function guardarDato(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (error) {
    console.warn('No se pudo guardar ' + clave, error);
    return false;
  }
}

// Devuelve los usuarios guardados; la primera vez siembra los perfiles demo.
export function obtenerUsuarios() {
  const guardados = leerListaGuardada(clavesDatos.usuarios);
  if (guardados !== null) return guardados;
  const usuarios = crearUsuariosIniciales();
  guardarDato(clavesDatos.usuarios, usuarios);
  return usuarios;
}

// Normalizar ayuda a leer tanto el catálogo original como productos del
// admin (que pueden traer descripción e imagen propia).
export function normalizarProducto(producto) {
  // El original copiaba campo por campo con copiarObjeto();
  // el spread {...producto} es el equivalente moderno.
  const normalizado = { ...producto };
  normalizado.codigo = String(producto.codigo || '')
    .trim()
    .toUpperCase();
  normalizado.nombre = String(producto.nombre || '').trim();
  normalizado.descripcion = String(producto.descripcion || '');
  normalizado.precioVenta = Number(producto.precioVenta) || 0;
  normalizado.stock = Number(producto.stock) || 0;
  normalizado.stockMinimo = Number(producto.stockMinimo) || 0;
  if (producto.imagen === undefined) {
    normalizado.imagen = 'assets/img/productos/' + normalizado.codigo + '.svg';
  } else {
    normalizado.imagen = producto.imagen || '';
  }
  return normalizado;
}

export function normalizarProductos(productos) {
  return productos.map(normalizarProducto);
}

// En el HTML5 esto era cargarProductos(): un fetch asíncrono con callbacks.
// Con el import estático la semilla ya viene embebida por Vite, así que el
// método es síncrono. El comportamiento observable es el mismo:
// 1. Si ya hay catálogo guardado en ep1-products, se usan esos datos
//    (respetando los cambios hechos desde el admin).
// 2. La primera vez se siembra desde el JSON y queda guardado.
export function obtenerProductos() {
  const guardados = leerListaGuardada(clavesDatos.productos);
  if (guardados !== null) return normalizarProductos(guardados);
  const productos = normalizarProductos(productosSemilla);
  guardarDato(clavesDatos.productos, productos);
  return productos;
}

// Crea o reemplaza un registro dentro de una lista guardada.
// - original: valor actual del campo clave (edición); vacío para crear.
// Devuelve false si el guardado falla, para que el formulario reintente.
export function guardarRegistro(clave, lista, campo, original, registro) {
  const actualizados = lista.slice();
  if (original) {
    const indice = actualizados.findIndex((item) => item[campo] === original);
    if (indice === -1) return false;
    actualizados[indice] = registro;
  } else {
    actualizados.push(registro);
  }
  return guardarDato(clave, actualizados);
}

// Perfiles de demostración universitaria (los tres entran con la clave demo123).
export function crearUsuariosIniciales() {
  return [
    {
      run: '123456785',
      nombre: 'Administrador',
      apellidos: 'Demo Grupo 6',
      correo: 'admin@duoc.cl',
      fechaNacimiento: '',
      tipoUsuario: 'Administrador',
      region: 'Región de Coquimbo',
      comuna: 'La Serena',
      direccion: 'Dirección de demostración',
      activo: true,
    },
    {
      run: '111111111',
      nombre: 'Vendedor',
      apellidos: 'Demo Grupo 6',
      correo: 'vendedor@profesor.duoc.cl',
      fechaNacimiento: '',
      tipoUsuario: 'Vendedor',
      region: 'Región de Coquimbo',
      comuna: 'Coquimbo',
      direccion: 'Dirección de demostración',
      activo: true,
    },
    {
      run: '222222222',
      nombre: 'Cliente',
      apellidos: 'Demo Grupo 6',
      correo: 'cliente@gmail.com',
      fechaNacimiento: '',
      tipoUsuario: 'Cliente',
      region: 'Región de Coquimbo',
      comuna: 'Ovalle',
      direccion: 'Dirección de demostración',
      activo: true,
    },
  ];
}
