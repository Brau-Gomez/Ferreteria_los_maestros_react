// Proveedor del carrito (Fase 2 del plan de migración).
// Porta la lógica de js/tienda/carrito.js:
// - Items con el producto completo + cantidad (estructura original).
// - Revalidación contra el catálogo en cada operación: los productos
//   sin stock se descartan y las cantidades se ajustan al máximo.
// - Persistencia en ep1-cart.
// - Al agregar se abre el panel lateral (la UI del panel llega en Fase 5;
//   su estado de apertura ya vive aquí, como en el original).
import { useEffect, useState } from 'react';
import { ContextoCarrito } from './CartContext.jsx';
import {
  clavesDatos,
  guardarDato,
  leerListaGuardada,
  obtenerProductos,
} from '../services/almacenamiento.js';

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
    persistir([]);
    return { ok: true, mensaje: '' };
  }

  // Valores derivados que consumen el Navbar y las páginas.
  const contador = items.reduce((suma, item) => suma + item.cantidad, 0);
  const total = items.reduce(
    (suma, item) => suma + item.precioVenta * item.cantidad,
    0,
  );

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
  };
  return (
    <ContextoCarrito.Provider value={valor}>
      {children}
    </ContextoCarrito.Provider>
  );
}
