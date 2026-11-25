// Catálogo de productos y mutaciones CRUD con TanStack Query.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  listarProductos, 
  crearProducto, 
  actualizarProducto, 
  eliminarProducto,
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  subirImagen
} from '../api/productosApi.js';

export function useProductos() {
  const { data: productos = [], isLoading, error, refetch } = useQuery({
    queryKey: ['productos'],
    queryFn: () => listarProductos(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return { productos, isLoading, error, refetch };
}

export function useCategorias() {
  const { data: categorias = [], isLoading, error, refetch } = useQuery({
    queryKey: ['categorias'],
    queryFn: listarCategorias,
    staleTime: 10 * 60 * 1000,
  });

  return { categorias, isLoading, error, refetch };
}

// Mutaciones para productos
export function useCrearProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
}

export function useActualizarProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ codigo, producto }) => actualizarProducto(codigo, producto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
}

export function useEliminarProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eliminarProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
}

export function useSubirImagen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ codigo, archivo }) => subirImagen(codigo, archivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
}

// Mutaciones para categorías
export function useCrearCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      queryClient.invalidateQueries({ queryKey: ['productos'] }); // productos referencian categorías
    },
  });
}

export function useActualizarCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ nombreAntiguo, nombreNuevo }) => actualizarCategoria(nombreAntiguo, nombreNuevo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
}

export function useEliminarCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
}