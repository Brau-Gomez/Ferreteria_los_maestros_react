// Proveedor del carrito persistido en el navegador.
// Porta la lógica de js/tienda/carrito.js:
// - Items con el producto completo + cantidad (estructura original).
// - Revalidación contra el catálogo en cada operación: los productos
//   sin stock se descartan y las cantidades se ajustan al máximo.
// - Persistencia en ep1-cart.
// - Al agregar se abre el panel lateral; su estado de apertura vive aquí,
//   como en el original.
import { useEffect, useState } from 'react';
import { ContextoCarrito } from './CartContext.jsx';
import {
  clavesDatos,
  guardarDato,
  leerListaGuardada,
  obtenerProductos,
} from '../services/almacenamiento.js';
import { cantidadCarrito, totalCarrito } from '../utils/carrito.js';

// Equivalente a actualizarDatosCarrito() del original: al operar se usan
// precios y stock actuales del catálogo.
function revalidarItems(guardados, productos) {
  const carrito = [];
  for (let i = 0; i < guardados.length; i++) {
    const producto = productos.find((p) => p.codigo === guardados[i].codigo);
    if (!producto || producto.stock < 1) continue;
    let cantidad = Number(guardados[i].cantidad);
    if (!Number.isFinite(cantidad) || cantidad < 1) continue;
    cantidad = Math.min(Math.floor(cantidad), Math.floor(producto.stock));
    const fila = { ...producto, cantidad };
    carrito.push(fila);
  }
  return carrito;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() =>
    revalidarItems(
      leerListaGuardada(clavesDatos.carrito) || [],
      obtenerProductos(),
    ),
  );
  const [panelAbierto, setPanelAbierto] = useState(false);

  // Sincroniza con otras pestañas del mismo navegador (evento storage),
  // como el actualizarContadorCarrito global del app.js original.
  useEffect(() => {
    function alCambiarStorage(evento) {
      if (evento.key !== clavesDatos.carrito) return;
      setItems(
        revalidarItems(
          leerListaGuardada(clavesDatos.carrito) || [],
          obtenerProductos(),
        ),
      );
    }
    window.addEventListener('storage', alCambiarStorage);
    return () => window.removeEventListener('storage', alCambiarStorage);
  }, []);

  // Guarda y actualiza el estado. Devuelve false si el guardado falla,
  // para avisar como en el original.
  function persistir(carrito) {
    if (!guardarDato(clavesDatos.carrito, carrito)) return false;
    setItems(carrito);
    return true;
  }

  // Agrega unidades de un producto. cantidad es opcional: desde el
  // catálogo se agrega de a una unidad (agregarAlCarrito del original).
  // Devuelve { ok, mensaje } para que la página muestre el aviso.
  function agregar(codigo, cantidad) {
    let pedidas = Number(cantidad);
    if (!Number.isFinite(pedidas) || pedidas < 1) pedidas = 1;
    pedidas = Math.floor(pedidas);

    const productos = obtenerProductos();
    const producto = productos.find((p) => p.codigo === codigo);
    if (!producto || producto.stock < 1) {
      return { ok: false, mensaje: 'Este producto no tiene stock disponible.' };
    }

    const carritoGuardado = leerListaGuardada(clavesDatos.carrito) || [];
    const carrito = revalidarItems(carritoGuardado, productos);
    const existente = carrito.find((i) => i.codigo === codigo);
    const cantidadActual = existente ? existente.cantidad : 0;
    const disponible = Math.max(0, Math.floor(producto.stock) - cantidadActual);
    if (disponible < 1) {
      return { ok: false, mensaje: 'Ya agregaste todo el stock disponible.' };
    }
    const agregadas = Math.min(pedidas, disponible);
    if (existente) {
      existente.cantidad += agregadas;
    } else {
      const fila = { ...producto };
      fila.cantidad = agregadas;
      carrito.push(fila);
    }

    if (!persistir(carrito)) {
      return {
        ok: false,
        mensaje: 'No se pudo guardar el carrito en este navegador.',
      };
    }
    // El original abre el panel lateral para confirmar la acción.
    setPanelAbierto(true);
    return {
      ok: true,
      mensaje:
        agregadas < pedidas
          ? `Se agregaron ${agregadas} de las ${pedidas} unidades solicitadas por el stock disponible.`
          : 'Producto agregado al carrito.',
    };
  }

  // cantidad 0 equivale a quitar el producto (cambiarCantidad del original).
  function cambiarCantidad(codigo, cantidad) {
    if (!Number.isInteger(cantidad) || cantidad < 0) {
      return {
        ok: false,
        mensaje:
          'La cantidad debe ser un número entero, igual o mayor a cero.',
      };
    }
    const productos = obtenerProductos();
    const carrito = revalidarItems(leerListaGuardada(clavesDatos.carrito) || [], productos);
    const nuevos = [];
    for (let i = 0; i < carrito.length; i++) {
      const producto = carrito[i];
      if (producto.codigo === codigo) {
        producto.cantidad = Math.min(cantidad, producto.stock);
      }
      if (producto.cantidad > 0) nuevos.push(producto);
    }
    if (!persistir(nuevos)) {
      return {
        ok: false,
        mensaje: 'No se pudo guardar el carrito en este navegador.',
      };
    }
    return { ok: true, mensaje: '' };
  }

  function quitar(codigo) {
    return cambiarCantidad(codigo, 0);
  }

  // "Vaciar carrito" del panel lateral (data-cart-clear del original).
  function vaciar() {
    if (!persistir([])) {
      return {
        ok: false,
        mensaje: 'No se pudo guardar el carrito en este navegador.',
      };
    }
    return { ok: true, mensaje: '' };
  }

  // Confirma el pedido de la página Carrito. Porta el submit de
  // js/tienda/carrito.js: valida sesión/entrega, guarda primero el pedido
  // en ep1-orders y solo después vacía ep1-cart. Si falla el segundo paso,
  // restaura los pedidos anteriores para no dejar datos inconsistentes.
  function confirmarPedido(usuario, entrega, despacho) {
    if (!usuario) {
      return {
        ok: false,
        mensaje: 'Inicia sesión antes de confirmar el pedido. Tu carrito se conserva.',
      };
    }
    if (entrega !== 'Retiro en tienda' && entrega !== 'Despacho') {
      return { ok: false, mensaje: 'Selecciona un tipo de entrega válido.' };
    }

    const carrito = revalidarItems(
      leerListaGuardada(clavesDatos.carrito) || [],
      obtenerProductos(),
    );
    if (!carrito.length) {
      return {
        ok: false,
        mensaje: 'No quedan productos disponibles en el carrito.',
      };
    }

    const anteriores = leerListaGuardada(clavesDatos.pedidos) || [];
      const pedido = {
        id: 'PED-' + Date.now(),
        runUsuario: usuario.run,
        total: totalCarrito(carrito),
        delivery: entrega,
        productos: carrito,
    };
    // Datos de despacho del checkout (opcional): solo si se informan.
    if (despacho) pedido.despacho = despacho;
    const pedidos = [pedido, ...anteriores];
    
    if (!guardarDato(clavesDatos.pedidos, pedidos)) {
      return {
        ok: false,
        mensaje: 'No se pudo guardar el pedido. El carrito se conserva.',
      };
    }
    if (!persistir([])) {
      guardarDato(clavesDatos.pedidos, anteriores);
      return {
        ok: false,
        mensaje: 'No se pudo guardar el carrito en este navegador.',
      };
    }
    setPanelAbierto(false);
    return { ok: true, mensaje: 'Pedido recibido.', pedidoId: pedido.id };
  }

  // Valores derivados que consumen el Navbar y las páginas.
  const contador = cantidadCarrito(items);
  const total = totalCarrito(items);

  const valor = {
    items,
    contador,
    total,
    panelAbierto,
    abrirPanel: () => setPanelAbierto(true),
    cerrarPanel: () => setPanelAbierto(false),
    agregar,
    cambiarCantidad,
    quitar,
    vaciar,
    confirmarPedido,
  };
  return (
    <ContextoCarrito.Provider value={valor}>
      {children}
    </ContextoCarrito.Provider>
  );
}
