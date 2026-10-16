// Pruebas de humo de los módulos base.
// Ejecutar con:  node scripts/smoke-test.mjs
//
// Verifica que la lógica portada del proyecto HTML5 funcione igual:
// RUN con dígito verificador, dinero, imágenes, validaciones y PBKDF2.
// No usa localStorage ni el JSON del catálogo: esos requieren navegador.
import { normalizarRun, runValido } from '../src/utils/run.js';
import { formatearDinero } from '../src/utils/dinero.js';
import { resolverImagen } from '../src/utils/imagenes.js';
import { estadoProducto, filtrarProductos, categoriasPresentes } from '../src/utils/productos.js';
import { cantidadCarrito, totalCarrito } from '../src/utils/carrito.js';
import { huellaClave } from '../src/utils/claves.js';
import {
  validarCorreo,
  validarClave,
  validarTexto,
} from '../src/utils/validaciones/comunes.js';
import { validarUsuario } from '../src/utils/validaciones/usuarios.js';
import { validarProducto } from '../src/utils/validaciones/productos.js';
import { validarContacto } from '../src/utils/validaciones/contacto.js';
import { comunasPorRegion } from '../src/data/regiones.js';
import { categoriasProducto } from '../src/data/categorias.js';
import { articulosBlog } from '../src/data/blog.js';
import fs from 'node:fs';

let pruebas = 0;
let fallos = 0;

function comprobar(descripcion, condicion) {
  pruebas++;
  if (condicion) {
    console.log('  \u2713 ' + descripcion);
  } else {
    fallos++;
    console.error('  \u2717 ' + descripcion);
  }
}

function sinErrores(errores) {
  return Object.values(errores).every((mensaje) => mensaje === '');
}

console.log('RUN chileno');
comprobar(
  'normaliza puntos, guiones y espacios',
  normalizarRun('12.345.678-5') === '123456785',
);
comprobar('acepta el RUN demo del admin', runValido('123456785') === true);
comprobar('acepta formato con puntos y guion', runValido('12.345.678-5') === true);
comprobar('acepta RUN con dígito K', runValido('99999993K') === true);
comprobar(
  'rechaza dígito verificador incorrecto',
  runValido('123456784') === false,
);
comprobar('rechaza texto basura', runValido('hola-mundo') === false);

console.log('Dinero');
comprobar('formatea CLP', formatearDinero(5990).includes('5.990'));

console.log('Imágenes');
comprobar(
  'resuelve assets/ a ruta pública',
  resolverImagen('assets/img/productos/MC001.svg') ===
    '/assets/img/productos/MC001.svg',
);
comprobar(
  'permite dataURL (imágenes subidas en el admin)',
  resolverImagen('data:image/png;base64,xx').startsWith('data:image/'),
);
comprobar('bloquea rutas externas', resolverImagen('http://malo.cl/x.png') === '');
comprobar(
  'remapea carpeta legada',
  resolverImagen('assets/img/img_corregidas/MC001.svg') ===
    '/assets/img/productos/MC001.svg',
);
comprobar('vacío devuelve vacío', resolverImagen('') === '');

console.log('Estado de producto');
comprobar(
  'stock bajo el mínimo es crítico',
  estadoProducto({ stock: 5, stockMinimo: 10 }) === 'Stock crítico',
);
comprobar(
  'stock sobre el mínimo está disponible',
  estadoProducto({ stock: 50, stockMinimo: 10 }) === 'Disponible',
);

console.log('Validaciones comunes');
comprobar('correo @duoc.cl válido', validarCorreo('admin@duoc.cl') === '');
comprobar('correo @gmail.com válido', validarCorreo('cliente@gmail.com') === '');
comprobar('dominio no permitido', validarCorreo('ana@yahoo.com') !== '');
comprobar('correo sin formato', validarCorreo('no-soy-un-correo') !== '');
comprobar('clave corta', validarClave('abc') !== '');
comprobar('clave demo123 válida', validarClave('demo123') === '');
comprobar('clave larga', validarClave('demodemodemo') !== '');
comprobar('texto obligatorio vacío', validarTexto('', 'El nombre', 50, true) !== '');
comprobar('texto opcional vacío pasa', validarTexto('', 'La descripción', 500, false) === '');

console.log('Región de Coquimbo');
comprobar(
  'solo se considera la Región de Coquimbo',
  Object.keys(comunasPorRegion).length === 1,
);
comprobar(
  'la región tiene sus 15 comunas oficiales',
  comunasPorRegion['Región de Coquimbo'].length === 15,
);
const comunasEsperadas = [
  'Andacollo', 'Canela', 'Combarbalá', 'Coquimbo', 'Illapel', 'La Higuera',
  'La Serena', 'Los Vilos', 'Monte Patria', 'Ovalle', 'Paihuano',
  'Punitaqui', 'Río Hurtado', 'Salamanca', 'Vicuña',
];
comprobar(
  'la lista de comunas coincide con la oficial',
  JSON.stringify(comunasPorRegion['Región de Coquimbo']) ===
    JSON.stringify(comunasEsperadas),
);
comprobar(
  'no hay comunas repetidas',
  new Set(comunasPorRegion['Región de Coquimbo']).size === 15,
);
comprobar('hay 9 categorías de producto', categoriasProducto.length === 9);

console.log('Blog de la portada');
comprobar('hay 3 artículos en la portada', articulosBlog.length === 3);
comprobar(
  'hay un único artículo destacado',
  articulosBlog.filter((a) => a.destacado).length === 1,
);
comprobar(
  'solo los artículos con slug muestran "Leer más"',
  articulosBlog.filter((a) => a.destacado).every((a) => !a.slug),
);
comprobar(
  'los slugs son únicos',
  new Set(articulosBlog.filter((a) => a.slug).map((a) => a.slug)).size === 2,
);
comprobar(
  'todos los artículos tienen texto e imagen',
  articulosBlog.every(
    (a) =>
      a.parrafos.length > 0 &&
      a.parrafos.every((p) => p.trim().length > 0) &&
      a.imagen &&
      a.alt,
  ),
);
comprobar(
  'las imágenes del blog existen en public/assets',
  articulosBlog.every((a) => fs.existsSync('public' + a.imagen)),
);
comprobar(
  'la foto de Nosotros existe en public/assets',
  fs.existsSync('public/assets/img/productos/img_portada/ferreteria.png'),
);

console.log('Filtros del catálogo');
const catalogoPrueba = [
  {
    codigo: 'HE001',
    nombre: 'Taladro percutor',
    marca: 'Bosch',
    categoria: 'Herramientas',
    stock: 5,
  },
  {
    codigo: 'PI002',
    nombre: 'Esmalte al agua',
    marca: 'Ceresita',
    categoria: 'Pinturas',
    stock: 0,
  },
  {
    codigo: 'TO003',
    nombre: 'Tornillo autoperforante',
    marca: '',
    categoria: 'Tornillería',
    stock: 200,
  },
];
comprobar(
  'la búsqueda encuentra por nombre',
  filtrarProductos(catalogoPrueba, { texto: 'taladro' }).map((p) => p.codigo)
    .join() === 'HE001',
);
comprobar(
  'la búsqueda también cubre marca y código',
  filtrarProductos(catalogoPrueba, { texto: 'ceresita' })
    .map((p) => p.codigo)
    .join() === 'PI002' &&
    filtrarProductos(catalogoPrueba, { texto: 'he001' })
      .map((p) => p.codigo)
      .join() === 'HE001',
);
const productosPinturas = filtrarProductos(catalogoPrueba, {
  categoria: 'Pinturas',
});
comprobar(
  'el filtro por categoría deja solo esa categoría',
  productosPinturas.length > 0 &&
    productosPinturas.every((p) => p.categoria === 'Pinturas'),
);
const productosConStock = filtrarProductos(catalogoPrueba, {
  soloStock: true,
});
comprobar(
  '"Sólo con stock" descarta los agotados',
  productosConStock.length > 0 && productosConStock.every((p) => p.stock > 0),
);
comprobar(
  'sin filtros se ven todos los productos',
  filtrarProductos(catalogoPrueba).length === 3,
);
comprobar(
  'una búsqueda sin coincidencias no devuelve nada',
  filtrarProductos(catalogoPrueba, { texto: 'noexisteenelcatalogo' }).length === 0,
);
comprobar(
  'las categorías del selector se derivan y ordenan',
  JSON.stringify(categoriasPresentes(catalogoPrueba)) ===
    JSON.stringify(['Herramientas', 'Pinturas', 'Tornillería']),
);

console.log('Cálculos del carrito');
const itemsCarritoPrueba = [
  { codigo: 'HE001', precioVenta: 12990, cantidad: 2 },
  { codigo: 'PI002', precioVenta: 4990, cantidad: 3 },
];
comprobar(
  'el contador suma todas las unidades',
  cantidadCarrito(itemsCarritoPrueba) === 5,
);
comprobar(
  'el total suma precio por cantidad de cada fila',
  totalCarrito(itemsCarritoPrueba) === 40950,
);
comprobar('un carrito vacío totaliza cero', totalCarrito([]) === 0);

console.log('Validación de usuario');
const usuarios = [{ run: '123456785', correo: 'admin@duoc.cl' }];
const usuarioValido = validarUsuario(
  {
    run: '111111111',
    nombre: 'Ana',
    apellidos: 'Pérez',
    correo: 'ana@gmail.com',
    direccion: 'Calle Falsa 123',
    tipoUsuario: 'Cliente',
    region: 'Región de Coquimbo',
    comuna: 'La Serena',
    fechaNacimiento: '',
  },
  usuarios,
  '',
);
comprobar('usuario válido no tiene errores', sinErrores(usuarioValido));
const usuarioDuplicado = validarUsuario(
  {
    run: '123456785',
    nombre: 'Otro',
    apellidos: 'Usuario',
    correo: 'admin@duoc.cl',
    direccion: 'Calle Falsa 123',
    tipoUsuario: 'Cliente',
    region: 'Región de Coquimbo',
    comuna: 'La Serena',
    fechaNacimiento: '',
  },
  usuarios,
  '',
);
comprobar('detecta RUN duplicado', usuarioDuplicado.run.includes('Ya existe'));
comprobar('detecta correo duplicado', usuarioDuplicado.correo.includes('Ya existe'));
const usuarioEditandose = validarUsuario(
  {
    run: '123456785',
    nombre: 'Administrador',
    apellidos: 'Demo',
    correo: 'admin@duoc.cl',
    direccion: 'Calle Falsa 123',
    tipoUsuario: 'Administrador',
    region: 'Región de Coquimbo',
    comuna: 'La Serena',
    fechaNacimiento: '',
  },
  usuarios,
  '123456785',
);
comprobar(
  'editarse a sí mismo no cuenta como duplicado',
  sinErrores(usuarioEditandose),
);
const usuarioComunaAjena = validarUsuario(
  {
    run: '111111111',
    nombre: 'Ana',
    apellidos: 'Pérez',
    correo: 'ana@gmail.com',
    direccion: 'Calle Falsa 123',
    tipoUsuario: 'Cliente',
    region: 'Región de Coquimbo',
    comuna: 'Santiago',
    fechaNacimiento: '',
  },
  usuarios,
  '',
);
comprobar(
  'rechaza una comuna fuera de la Región de Coquimbo',
  usuarioComunaAjena.comuna === 'Selecciona una comuna de la región.',
);
const usuarioRegionAjena = validarUsuario(
  {
    run: '111111111',
    nombre: 'Ana',
    apellidos: 'Pérez',
    correo: 'ana@gmail.com',
    direccion: 'Calle Falsa 123',
    tipoUsuario: 'Cliente',
    region: 'Región de Valparaíso',
    comuna: 'Valparaíso',
    fechaNacimiento: '',
  },
  usuarios,
  '',
);
comprobar(
  'rechaza una región distinta a Coquimbo',
  usuarioRegionAjena.region === 'Selecciona una región.',
);
const usuarioComunaReal = validarUsuario(
  {
    run: '111111111',
    nombre: 'Ana',
    apellidos: 'Pérez',
    correo: 'ana@gmail.com',
    direccion: 'Calle Falsa 123',
    tipoUsuario: 'Cliente',
    region: 'Región de Coquimbo',
    comuna: 'Paihuano',
    fechaNacimiento: '',
  },
  usuarios,
  '',
);
comprobar('acepta cualquier comuna oficial de la región', sinErrores(usuarioComunaReal));

console.log('Validación de producto');
const productos = [{ codigo: 'MC001', nombre: 'Cemento Polpaico gris 25 kg' }];
const productoValido = validarProducto(
  {
    codigo: 'XX001',
    nombre: 'Taladro percutor',
    descripcion: '',
    precio: '45000',
    stock: '10',
    stockCritico: '3',
    categoria: 'Herramientas',
  },
  productos,
  '',
  null,
);
comprobar('producto válido no tiene errores', sinErrores(productoValido));
const productoDuplicado = validarProducto(
  {
    codigo: 'MC001',
    nombre: 'Otro cemento',
    descripcion: '',
    precio: '1000',
    stock: '10',
    stockCritico: '3',
    categoria: 'Mat. Construcción',
  },
  productos,
  '',
  null,
);
comprobar('detecta código duplicado', productoDuplicado.codigo.includes('Ya existe'));
const productoConErrores = validarProducto(
  {
    codigo: 'AB',
    nombre: '',
    descripcion: '',
    precio: '-5',
    stock: '2.5',
    stockCritico: '',
    categoria: 'No existe',
  },
  productos,
  '',
  null,
);
comprobar('código corto', productoConErrores.codigo !== '');
comprobar('nombre obligatorio', productoConErrores.nombre !== '');
comprobar('precio negativo', productoConErrores.precio !== '');
comprobar('stock con decimales', productoConErrores.stock !== '');
comprobar('categoría inexistente', productoConErrores.categoria !== '');

console.log('Validación de contacto');
const contacto = validarContacto({ nombre: 'Juan', correo: 'mal', comentario: 'Hola' });
comprobar('correo inválido en contacto', contacto.correo !== '');
comprobar('contacto completo pasa', sinErrores(
  validarContacto({
    nombre: 'Juan',
    correo: 'cliente@gmail.com',
    comentario: 'Hola, necesito cotizar cemento.',
  }),
));

console.log('Huella de clave (PBKDF2)');
const huella = await huellaClave('demo123', 'sal-de-prueba');
comprobar('la huella es hexadecimal de 64 caracteres', /^[0-9a-f]{64}$/.test(huella));
const huellaOtra = await huellaClave('demo123', 'otra-sal');
comprobar('cada sal produce una huella distinta', huella !== huellaOtra);

console.log('');
if (fallos === 0) {
  console.log('\u2714 ' + pruebas + ' pruebas pasaron');
} else {
  console.error('\u2717 ' + fallos + ' de ' + pruebas + ' pruebas fallaron');
  process.exit(1);
}
