// Servidor falso para las pruebas: reemplaza el adaptador HTTP de apiClient
// y responde las mismas rutas que el backend real (/products, /cart, /orders,
// /users, /auth...). Así las pruebas ejercitan el código real de src/api/*.
//
// Los datos viven en localStorage con las mismas claves que usan las pruebas
// para preparar cada caso (ep1-products, ep1-categories, ep1-cart, ep1-orders,
// ep1-users, ep1-user), y cada prueba puede revisar ahí lo que "guardó el backend".

const CLAVES = {
  productos: 'ep1-products',
  categorias: 'ep1-categories',
  carrito: 'ep1-cart',
  ordenes: 'ep1-orders',
  usuarios: 'ep1-users',
  sesion: 'ep1-user',
};

const CLAVE_DEMO = 'demo123';

const USUARIOS_DEMO = [
  { run: '123456785', nombre: 'Administrador', apellidos: 'Demo', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true },
  { run: '111111111', nombre: 'Vendedor', apellidos: 'Demo', correo: 'vendedor@profesor.duoc.cl', tipoUsuario: 'Vendedor', activo: true },
  { run: '222222222', nombre: 'Ana', apellidos: 'Demo', correo: 'cliente@gmail.com', tipoUsuario: 'Cliente', activo: true },
  { run: '333333333', nombre: 'Carlos', apellidos: 'Contratista', correo: 'contratista@gmail.com', tipoUsuario: 'Cliente', esContratista: true, activo: true },
];

function leer(clave, porDefecto) {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// ---------- Datos ----------

function productos() {
  return leer(CLAVES.productos, []);
}

function categorias() {
  const guardadas = leer(CLAVES.categorias, null);
  if (Array.isArray(guardadas)) return guardadas;
  return [...new Set(productos().map((p) => p.categoria).filter(Boolean))];
}

function usuarios() {
  return leer(CLAVES.usuarios, USUARIOS_DEMO);
}

function rolesDe(usuario) {
  if (Array.isArray(usuario.roles)) return usuario.roles;
  if (usuario.tipoUsuario === 'Administrador') return ['ADMIN'];
  if (usuario.tipoUsuario === 'Vendedor') return ['VENDEDOR'];
  return usuario.esContratista ? ['CONTRATISTA'] : ['CLIENTE'];
}

// El backend envía los roles; normalizarUsuario calcula tipoUsuario con ellos.
function conRoles(usuario) {
  return usuario ? { ...usuario, roles: rolesDe(usuario) } : usuario;
}

// Usuario tal como lo devuelve user-service: id, rut y rol en texto.
function usuarioApi(usuario) {
  const roles = rolesDe(usuario);
  return { ...usuario, id: idUsuario(usuario), rut: usuario.run, rol: roles[0] };
}

const TIPO_POR_ROL = { ADMIN: 'Administrador', VENDEDOR: 'Vendedor', CLIENTE: 'Cliente', CONTRATISTA: 'Cliente' };

function usuarioDesdeApi(cuerpo, anterior = {}) {
  const [nombre = '', ...apellidos] = String(cuerpo.nombreCompleto || '').split(' ');
  const rol = cuerpo.rol || rolesDe(anterior)[0];
  const { roles: _roles, ...resto } = anterior;
  return {
    ...resto,
    run: cuerpo.rut ?? anterior.run,
    nombre,
    apellidos: apellidos.join(' '),
    correo: cuerpo.email,
    telefono: cuerpo.telefono ?? anterior.telefono,
    tipoUsuario: TIPO_POR_ROL[rol] || 'Cliente',
    esContratista: rol === 'CONTRATISTA',
    activo: anterior.activo ?? true,
  };
}

function sesion() {
  return leer(CLAVES.sesion, null);
}

function buscarProducto(codigo) {
  const objetivo = String(codigo || '').toUpperCase();
  return productos().find((p) => String(p.codigo).toUpperCase() === objetivo);
}

// El backend identifica productos, categorías y usuarios por id (UUID).
const idProducto = (producto) => `prod-${String(producto.codigo).toUpperCase()}`;
const idCategoria = (nombre) => `cat-${nombre}`;
const idUsuario = (usuario) => usuario.id ?? `usr-${usuario.run}`;
const conId = (producto) => ({ ...producto, id: idProducto(producto) });
const categoriaConId = (nombre) => ({ id: idCategoria(nombre), name: nombre, active: true });

function categoriaDeId(categoryId) {
  return categorias().find((nombre) => idCategoria(nombre) === categoryId) ?? '';
}

// El backend recibe el producto con nombres en inglés (convertirProducto).
function productoDesdeApi(cuerpo, anterior = {}) {
  return {
    ...anterior,
    codigo: cuerpo.code ?? anterior.codigo,
    nombre: cuerpo.name ?? anterior.nombre,
    descripcion: cuerpo.description ?? anterior.descripcion ?? '',
    precioVenta: Number(cuerpo.price ?? anterior.precioVenta ?? 0),
    precioAnterior: cuerpo.compareAtPrice != null ? Number(cuerpo.compareAtPrice) : anterior.precioAnterior,
    stock: Number(cuerpo.stock ?? anterior.stock ?? 0),
    stockMinimo: Number(cuerpo.minStock ?? anterior.stockMinimo ?? 0),
    categoria: cuerpo.categoryId ? categoriaDeId(cuerpo.categoryId) : anterior.categoria ?? '',
    enOferta: cuerpo.featured ?? anterior.enOferta ?? false,
  };
}

function itemCarrito(item) {
  const producto = buscarProducto(item.codigo) || {};
  return {
    code: item.codigo,
    name: producto.nombre,
    description: producto.descripcion,
    unitPrice: producto.precioVenta ?? item.precioVenta ?? 0,
    quantity: item.cantidad,
    stock: producto.stock ?? 0,
    featured: producto.enOferta ?? false,
  };
}

// ---------- Respuestas ----------

function ok(data, status = 200) {
  return { status, data };
}

function error(status, mensaje) {
  return { status, data: { message: mensaje, mensaje } };
}

function rutas(metodo, ruta, cuerpo, params) {
  const partes = ruta.split('/').filter(Boolean).map(decodeURIComponent);
  const [recurso, a, b] = partes;

  // ----- Autenticación -----
  if (recurso === 'auth') {
    if (a === 'login' && metodo === 'post') {
      const usuario = usuarios().find(
        (u) => u.correo === cuerpo?.email && u.activo !== false,
      );
      if (!usuario || cuerpo?.password !== CLAVE_DEMO) {
        return error(401, 'Correo o contraseña incorrectos.');
      }
      guardar(CLAVES.sesion, usuario);
      return ok({ accessToken: 'token-falso', refreshToken: 'refresh-falso', user: conRoles(usuario) });
    }
    if (a === 'me') {
      const usuario = sesion();
      return usuario ? ok(conRoles(usuario)) : error(401, 'Sin sesión');
    }
    if (a === 'logout') {
      localStorage.removeItem(CLAVES.sesion);
      return ok(null, 204);
    }
    if (a === 'refresh') return error(401, 'Sin sesión');
    if (a === 'register' && metodo === 'post') {
      const lista = usuarios();
      if (lista.some((u) => u.correo === cuerpo.email)) return error(409, 'El correo ya está registrado.');
      const [nombre = '', ...apellidos] = String(cuerpo.fullName || '').split(' ');
      const nuevo = { nombre, apellidos: apellidos.join(' '), correo: cuerpo.email, tipoUsuario: 'Cliente', activo: true };
      guardar(CLAVES.usuarios, [...lista, nuevo]);
      return ok(conRoles(nuevo), 201);
    }
  }

  // ----- Productos -----
  if (recurso === 'products') {
    if (!a && metodo === 'get') {
      const soloActivas = String(params?.soloActivas) === 'true';
      const lista = productos()
        .filter((p) => !soloActivas || p.activo !== false)
        .map(conId);
      const pagina = Number(params?.page ?? 0);
      return ok({ content: pagina === 0 ? lista : [], last: true });
    }
    if (!a && metodo === 'post') {
      if (buscarProducto(cuerpo.code)) return error(409, 'Ya existe un producto con ese código.');
      if (!cuerpo.categoryId) return error(400, 'La categoría es obligatoria');
      const nuevo = productoDesdeApi(cuerpo);
      guardar(CLAVES.productos, [...productos(), nuevo]);
      return ok(conId(nuevo), 201);
    }
    if (a === 'code' && metodo === 'get') {
      const existente = buscarProducto(b);
      return existente ? ok(conId(existente)) : error(404, 'Producto no encontrado');
    }
    if (a && a !== 'code') {
      const existente = productos().find((p) => idProducto(p) === a);
      if (!existente) return error(404, 'Producto no encontrado');
      if (b === 'images' && metodo === 'post') return ok({ id: 'img-1', url: cuerpo.url }, 201);
      if (!b && metodo === 'put') {
        if (!cuerpo.categoryId) return error(400, 'La categoría es obligatoria');
        const actualizado = productoDesdeApi(cuerpo, existente);
        guardar(CLAVES.productos, productos().map((p) => (p.codigo === existente.codigo ? actualizado : p)));
        return ok(conId(actualizado));
      }
      if (!b && metodo === 'delete') {
        // Igual que el backend real: el producto se desactiva, no se borra.
        guardar(CLAVES.productos, productos().map((p) => (p.codigo === existente.codigo ? { ...p, activo: false } : p)));
        return ok(null, 204);
      }
    }
    return error(405, `Método no soportado: ${metodo.toUpperCase()} ${ruta}`);
  }

  // ----- Categorías -----
  if (recurso === 'categories') {
    const lista = categorias();
    if (a === 'activas' && metodo === 'get') return ok(lista.map(categoriaConId));
    if (!a && metodo === 'post') {
      const nombre = String(cuerpo?.name ?? '').trim();
      if (!nombre) return error(400, 'El nombre es obligatorio');
      guardar(CLAVES.categorias, [...lista, nombre]);
      return ok(categoriaConId(nombre), 201);
    }
    const actual = lista.find((cat) => idCategoria(cat) === a);
    if (a && !actual) return error(404, 'Categoría no encontrada');
    if (a && metodo === 'put') {
      const nuevo = String(cuerpo?.name ?? '').trim();
      guardar(CLAVES.categorias, lista.map((cat) => (cat === actual ? nuevo : cat)));
      guardar(CLAVES.productos, productos().map((p) => (p.categoria === actual ? { ...p, categoria: nuevo } : p)));
      return ok(categoriaConId(nuevo));
    }
    if (a && metodo === 'delete') {
      guardar(CLAVES.categorias, lista.filter((cat) => cat !== actual));
      return ok(null, 204);
    }
  }

  // ----- Carrito -----
  if (recurso === 'cart') {
    const items = leer(CLAVES.carrito, []);
    if (!a && metodo === 'get') return ok(items.map(itemCarrito));
    if (!a && metodo === 'delete') {
      guardar(CLAVES.carrito, []);
      return ok(null, 204);
    }
    if (a === 'items' && !b && metodo === 'post') {
      const codigo = cuerpo.code;
      const cantidad = Number(cuerpo.quantity || 1);
      const existente = items.find((i) => i.codigo === codigo);
      const siguientes = existente
        ? items.map((i) => (i.codigo === codigo ? { ...i, cantidad: i.cantidad + cantidad } : i))
        : [...items, { codigo, cantidad }];
      guardar(CLAVES.carrito, siguientes);
      return ok(itemCarrito(siguientes.find((i) => i.codigo === codigo)), 201);
    }
    if (a === 'items' && b && metodo === 'patch') {
      const siguientes = items.map((i) => (i.codigo === b ? { ...i, cantidad: Number(cuerpo.quantity) } : i));
      guardar(CLAVES.carrito, siguientes);
      return ok(itemCarrito(siguientes.find((i) => i.codigo === b) || { codigo: b, cantidad: 0 }));
    }
    if (a === 'items' && b && metodo === 'delete') {
      guardar(CLAVES.carrito, items.filter((i) => i.codigo !== b));
      return ok(null, 204);
    }
  }

  // ----- Órdenes -----
  if (recurso === 'orders') {
    const lista = leer(CLAVES.ordenes, []);
    if (!a && metodo === 'get') return ok({ content: lista, last: true });
    if (!a && metodo === 'post') {
      const items = (cuerpo.items || []).map((item) => {
        const producto = buscarProducto(item.productCode) || {};
        return {
          productCode: item.productCode,
          productName: producto.nombre,
          quantity: item.quantity,
          unitPrice: producto.precioVenta ?? 0,
        };
      });
      const total = items.reduce((suma, item) => suma + item.unitPrice * item.quantity, 0);
      const orden = {
        id: `PED-${Date.now()}`,
        status: 'CONFIRMED',
        total,
        items,
        notes: cuerpo.notes,
        shippingAddress: cuerpo.shippingAddress,
        createdAt: new Date().toISOString(),
        customerEmail: sesion()?.correo,
      };
      guardar(CLAVES.ordenes, [...lista, orden]);
      guardar(CLAVES.carrito, []);
      return ok(orden, 201);
    }
    if (a && !b && metodo === 'get') {
      const orden = lista.find((o) => o.id === a);
      return orden ? ok(orden) : error(404, 'Orden no encontrada');
    }
    if (a && b === 'status' && metodo === 'patch') {
      const estado = params?.status;
      const siguientes = lista.map((o) => (o.id === a ? { ...o, status: estado, estado } : o));
      guardar(CLAVES.ordenes, siguientes);
      return ok(siguientes.find((o) => o.id === a));
    }
  }

  // ----- Usuarios -----
  if (recurso === 'users') {
    const lista = usuarios();
    if (!a && metodo === 'get') return ok({ content: lista.map(usuarioApi), last: true });
    if (!a && metodo === 'post') {
      if (!cuerpo?.email || !cuerpo?.nombreCompleto) return error(400, 'Datos incompletos');
      if (lista.some((u) => u.run === cuerpo.rut)) return error(400, 'El RUT ya está registrado');
      const nuevo = usuarioDesdeApi(cuerpo);
      guardar(CLAVES.usuarios, [...lista, nuevo]);
      return ok(usuarioApi(nuevo), 201);
    }
    const existente = lista.find((u) => idUsuario(u) === a);
    if (a && !existente) return error(404, 'Usuario no encontrado');
    if (a && metodo === 'get') return ok(usuarioApi(existente));
    if (a && metodo === 'put') {
      const actualizado = usuarioDesdeApi(cuerpo, existente);
      guardar(CLAVES.usuarios, lista.map((u) => (u === existente ? actualizado : u)));
      return ok(usuarioApi(actualizado));
    }
    if (a && metodo === 'delete') {
      guardar(CLAVES.usuarios, lista.filter((u) => u !== existente));
      return ok(null, 204);
    }
  }

  // ----- Cuenta corriente -----
  if (recurso === 'cuentas-corrientes' && a === 'me') {
    return ok({ limiteCredito: 500000, saldoDisponible: 500000, saldoUtilizado: 0, diaCorte: 28 });
  }

  // ----- Catálogo geográfico y pagos -----
  if (recurso === 'regions') return ok([{ id: 1, name: 'Región de Coquimbo' }]);
  if (recurso === 'communes') return ok([{ id: 1, name: 'La Serena', regionId: 1 }, { id: 2, name: 'Coquimbo', regionId: 1 }]);
  if (recurso === 'coverage') return ok([{ communeId: 1, covered: true, deliveryCost: 3990 }]);
  if (recurso === 'payments') {
    const tarjeta = String(cuerpo?.numeroTarjeta ?? '');
    return ok(tarjeta.endsWith('0000')
      ? { aprobado: false, estado: 'RECHAZADO', mensaje: 'El banco rechazó la tarjeta.' }
      : { aprobado: true, estado: 'APROBADO', mensaje: 'Pago aprobado.', transactionId: 'PAY-DEMO-123' });
  }

  return error(404, `Ruta no simulada: ${metodo.toUpperCase()} ${ruta}`);
}

// Permite simular que el backend falla en la siguiente petición
// (por ejemplo, para probar los mensajes de error de un formulario).
let falloPendiente = null;
export function fallarSiguientePeticion(status = 500, mensaje = 'Error del servidor') {
  falloPendiente = { status, mensaje };
}

// Adaptador de axios: recibe la configuración de la petición y devuelve una
// respuesta, o la rechaza como lo haría axios con un error HTTP.
export async function adaptadorFalso(config) {
  const ruta = String(config.url || '').split('?')[0];
  let cuerpo = config.data;
  if (typeof cuerpo === 'string') {
    try { cuerpo = JSON.parse(cuerpo); } catch { /* cuerpo no JSON */ }
  }
  const metodo = String(config.method || 'get').toLowerCase();
  let respuesta;
  if (falloPendiente && metodo !== 'get') {
    respuesta = error(falloPendiente.status, falloPendiente.mensaje);
    falloPendiente = null;
  } else {
    respuesta = rutas(metodo, ruta, cuerpo, config.params);
  }
  const completa = { ...respuesta, statusText: '', headers: {}, config, request: {} };
  if (respuesta.status >= 400) {
    const fallo = new Error(respuesta.data?.mensaje || `HTTP ${respuesta.status}`);
    fallo.response = completa;
    fallo.config = config;
    fallo.isAxiosError = true;
    throw fallo;
  }
  return completa;
}

export function limpiarServidorFalso() {
  falloPendiente = null;
}
