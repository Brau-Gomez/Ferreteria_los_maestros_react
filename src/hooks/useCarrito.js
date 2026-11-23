// Hooks para carrito con TanStack Query y mutaciones optimistas.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  obtenerCarrito, 
  agregarAlCarrito, 
  actualizarCantidadCarrito, 
  quitarDelCarrito, 
  vaciarCarrito 
} from '../api/carritoApi.js';
import { useContext } from 'react';
import { ContextoCarrito } from '../context/CartContext.jsx';
import { totalCarrito } from '../utils/carrito.js';

// Hook para usar el contexto del carrito (compatibilidad con código existente)
export function useCarrito() {
  const contexto = useContext(ContextoCarrito);
  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de CartProvider.');
  }
  return contexto;
}

// Hooks con TanStack Query para componentes nuevos
export function useCarritoQuery() {
  const { data: items = [], isLoading, error, refetch } = useQuery({
    queryKey: ['carrito'],
    queryFn: obtenerCarrito,
    staleTime: 0,
  });

  // El total se calcula en el cliente: el endpoint /cart solo devuelve ítems.
  return { items, total: totalCarrito(items), isLoading, error, refetch };
}

export function useAgregarAlCarrito() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ codigo, cantidad }) => agregarAlCarrito(codigo, cantidad),
    onMutate: async ({ codigo, cantidad }) => {
      await queryClient.cancelQueries({ queryKey: ['carrito'] });
      const previousItems = queryClient.getQueryData(['carrito']) || [];
      
      const existingIndex = previousItems.findIndex(item => item.codigo === codigo);
      let optimisticItems;
      if (existingIndex >= 0) {
        optimisticItems = previousItems.map((item, i) => 
          i === existingIndex ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      } else {
        optimisticItems = [...previousItems, { codigo, cantidad, _optimistic: true }];
      }
      
      queryClient.setQueryData(['carrito'], optimisticItems);
      return { previousItems };
    },
    onError: (err, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(['carrito'], context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['carrito'] });
    },
  });
}

export function useActualizarCantidadCarrito() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ codigo, cantidad }) => actualizarCantidadCarrito(codigo, cantidad),
    onMutate: async ({ codigo, cantidad }) => {
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
      return { previousItems };
    },
    onError: (err, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(['carrito'], context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['carrito'] });
    },
  });
}

export function useQuitarDelCarrito() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: quitarDelCarrito,
    onMutate: async (codigo) => {
      await queryClient.cancelQueries({ queryKey: ['carrito'] });
      const previousItems = queryClient.getQueryData(['carrito']) || [];
      const optimisticItems = previousItems.filter(item => item.codigo !== codigo);
      queryClient.setQueryData(['carrito'], optimisticItems);
      return { previousItems };
    },
    onError: (err, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(['carrito'], context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['carrito'] });
    },
  });
}

export function useVaciarCarrito() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vaciarCarrito,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['carrito'] });
      const previousItems = queryClient.getQueryData(['carrito']) || [];
      queryClient.setQueryData(['carrito'], []);
      return { previousItems };
    },
    onError: (err, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(['carrito'], context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['carrito'] });
    },
  });
}