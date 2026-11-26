// Proveedor del carrito con actualizaciones optimistas via TanStack Query.
// Mantiene la misma interfaz que el original para compatibilidad.
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ContextoCarrito } from './CartContext.jsx';
import { useSesion } from '@/hooks/useSesion.js';
import { 
  obtenerCarrito, 
  agregarAlCarrito, 
  actualizarCantidadCarrito, 
  quitarDelCarrito, 
  vaciarCarrito 
} from '@/api/carritoApi.js';
import { cantidadCarrito, totalCarrito } from '@/utils/carrito.js';

export function CartProvider({ children }) {
  const queryClient = useQueryClient();
  const [panelAbierto, setPanelAbierto] = useState(false);

  // Invalidar carrito al montar y al cambiar pestaña
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['carrito'] });
    
    function alCambiarStorage(evento) {
      if (evento.key === 'carrito-sync') {
        queryClient.invalidateQueries({ queryKey: ['carrito'] });
      }
    }
    window.addEventListener('storage', alCambiarStorage);
    return () => window.removeEventListener('storage', alCambiarStorage);
  }, [queryClient]);

  // El carrito vive en el backend y exige JWT: solo se pide con sesión iniciada.
  const { isAuthenticated } = useSesion();
  const { data: items = [] } = useQuery({
    queryKey: ['carrito'],
    queryFn: obtenerCarrito,
    enabled: isAuthenticated,
  });

  // Al cerrar sesión no dejamos el carrito de otro usuario en el cache
  useEffect(() => {
    if (!isAuthenticated) queryClient.removeQueries({ queryKey: ['carrito'] });
  }, [isAuthenticated, queryClient]);

  // Mutación optimista: agregar al carrito
  async function agregar(codigo, cantidad) {
    // El carrito vive en cart-service y exige token: sin sesión no se llama a la API
    // (respondería 401) y se le explica al visitante qué hacer.
    if (!isAuthenticated) {
      return { ok: false, mensaje: 'Inicia sesión para agregar productos al carrito.' };
    }
    let pedidas = Number(cantidad);
    if (!Number.isFinite(pedidas) || pedidas < 1) pedidas = 1;
    pedidas = Math.floor(pedidas);

    // Solo se adelanta la cantidad de un ítem que ya está en el carrito;
    // el producto nuevo llega completo en la respuesta del POST.
    await queryClient.cancelQueries({ queryKey: ['carrito'] });
    const previousItems = queryClient.getQueryData(['carrito']) || [];
    queryClient.setQueryData(['carrito'], previousItems.map((item) =>
      item.codigo === codigo ? { ...item, cantidad: item.cantidad + pedidas } : item,
    ));

    try {
      const resultado = await agregarAlCarrito(codigo, pedidas);
      // El invalidate traerá la respuesta real del server
      queryClient.setQueryData(['carrito'], (actuales = []) => [
        ...actuales.filter(i => i.codigo !== codigo), resultado
      ]);
      queryClient.invalidateQueries({ queryKey: ['carrito'] });
      setPanelAbierto(true);
      return {
        ok: true,
        mensaje: 'Producto agregado al carrito.',
      };
    } catch (error) {
      // Rollback
      queryClient.setQueryData(['carrito'], previousItems);
      const msg = error.response?.data?.mensaje || 'No se pudo agregar el producto.';
      return { ok: false, mensaje: msg };
    }
  }

  // Mutación optimista: cambiar cantidad
  async function cambiarCantidad(codigo, cantidad) {
    if (!Number.isInteger(cantidad) || cantidad < 0) {
      return {
        ok: false,
        mensaje: 'La cantidad debe ser un número entero, igual o mayor a cero.',
      };
    }

    await queryClient.cancelQueries({ queryKey: ['carrito'] });
    const previousItems = queryClient.getQueryData(['carrito']) || [];
    
    let optimisticItems;
    if (cantidad === 0) {
      optimisticItems = previousItems.filter(item => item.codigo !== codigo);
    } else {
      optimisticItems = previousItems.map(item => 
        item.codigo === codigo ? { ...item, cantidad } : item
      );
    }
    
    queryClient.setQueryData(['carrito'], optimisticItems);

    try {
      if (cantidad === 0) {
        await quitarDelCarrito(codigo);
      } else {
        await actualizarCantidadCarrito(codigo, cantidad);
      }
      queryClient.invalidateQueries({ queryKey: ['carrito'] });
      return { ok: true, mensaje: '' };
    } catch (error) {
      queryClient.setQueryData(['carrito'], previousItems);
      const msg = error.response?.data?.mensaje || 'No se pudo actualizar el carrito.';
      return { ok: false, mensaje: msg };
    }
  }

  function quitar(codigo) {
    return cambiarCantidad(codigo, 0);
  }

  // Mutación optimista: vaciar carrito
  async function vaciar() {
    await queryClient.cancelQueries({ queryKey: ['carrito'] });
    const previousItems = queryClient.getQueryData(['carrito']) || [];
    queryClient.setQueryData(['carrito'], []);

    try {
      await vaciarCarrito();
      queryClient.invalidateQueries({ queryKey: ['carrito'] });
      return { ok: true, mensaje: '' };
    } catch (error) {
      queryClient.setQueryData(['carrito'], previousItems);
      const msg = error.response?.data?.mensaje || 'No se pudo vaciar el carrito.';
      return { ok: false, mensaje: msg };
    }
  }

  // Confirma el pedido delegando al backend (CheckoutContainer usa API directa)
  async function confirmarPedido(usuario, entrega, despacho) {
    if (!usuario) {
      return {
        ok: false,
        mensaje: 'Inicia sesión antes de confirmar el pedido. Tu carrito se conserva.',
      };
    }
    if (entrega !== 'Retiro en tienda' && entrega !== 'Despacho') {
      return { ok: false, mensaje: 'Selecciona un tipo de entrega válido.' };
    }

    const carrito = items;
    if (!carrito.length) {
      return {
        ok: false,
        mensaje: 'No quedan productos disponibles en el carrito.',
      };
    }

    return { ok: true, mensaje: 'Usar CheckoutContainer para confirmar.', pedidoId: null };
  }

  // Valores derivados
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