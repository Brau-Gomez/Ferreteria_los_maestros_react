// Container de categorías del admin: valida, persiste y mantiene
// coherentes los productos (al renombrar) y el catálogo (al eliminar) via API.
// Solo renderiza GestionCategoriasAdmin.
import { useState, useEffect } from 'react';
import GestionCategoriasAdmin from '@/components/organisms/admin/GestionCategoriasAdmin.jsx';
import { useProductos } from '@/hooks/useProductos.js';
import { useCategorias, useCrearCategoria, useActualizarCategoria, useEliminarCategoria } from '@/hooks/useProductos.js';
import { contarPorCategoria } from '@/utils/productos.js';
import { validarCategoria } from '@/utils/validaciones/categorias.js';

function AdminCategoriasContainer() {
  const { categorias, isLoading: catLoading, refetch: refetchCategorias } = useCategorias();
  const { productos, isLoading: prodLoading, refetch: refetchProductos } = useProductos();
  
  const crearCategoriaMutation = useCrearCategoria();
  const actualizarCategoriaMutation = useActualizarCategoria();
  const eliminarCategoriaMutation = useEliminarCategoria();
  
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [editando, setEditando] = useState('');
  const [valorEdicion, setValorEdicion] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const loading = catLoading || prodLoading || 
    crearCategoriaMutation.isPending || 
    actualizarCategoriaMutation.isPending || 
    eliminarCategoriaMutation.isPending;

  function avisar(nuevoError, nuevoMensaje) {
    setError(nuevoError);
    setMensaje(nuevoMensaje);
  }

  async function agregar() {
    const problema = validarCategoria(nuevoNombre, categorias);
    if (problema) return avisar(problema, '');
    try {
      setError('');
      await crearCategoriaMutation.mutateAsync({ nombre: nuevoNombre.trim() });
      await Promise.all([refetchCategorias(), refetchProductos()]);
      setNuevoNombre('');
      avisar('', `Categoría "${nuevoNombre.trim()}" creada.`);
    } catch (err) {
      const msg = err.response?.data?.mensaje || err.message || 'No se pudo guardar la categoría.';
      avisar(msg, '');
    }
  }

  function empezarEdicion(nombre) {
    setEditando(nombre);
    setValorEdicion(nombre);
    avisar('', '');
  }

  function cancelarEdicion() {
    setEditando('');
    setValorEdicion('');
    avisar('', '');
  }

  async function guardarEdicion() {
    const problema = validarCategoria(valorEdicion, categorias, editando);
    if (problema) return avisar(problema, '');
    try {
      setError('');
      await actualizarCategoriaMutation.mutateAsync({ 
        nombreAntiguo: editando, 
        nombreNuevo: valorEdicion.trim() 
      });
      await Promise.all([refetchCategorias(), refetchProductos()]);
      setEditando('');
      setValorEdicion('');
      avisar('', `Categoría renombrada a "${valorEdicion.trim()}".`);
    } catch (err) {
      const msg = err.response?.data?.mensaje || err.message || 'No se pudo guardar la categoría.';
      avisar(msg, '');
    }
  }

  async function eliminar(nombre) {
    const usados = productos.filter((producto) => producto.categoria === nombre).length;
    if (usados > 0) {
      return avisar(`No se puede eliminar "${nombre}": tiene ${usados} producto(s) asociados.`, '');
    }
    if (!window.confirm(`¿Eliminar la categoría "${nombre}"?`)) return;
    try {
      setError('');
      await eliminarCategoriaMutation.mutateAsync(nombre);
      await Promise.all([refetchCategorias(), refetchProductos()]);
      avisar('', `Categoría "${nombre}" eliminada.`);
    } catch (err) {
      const msg = err.response?.data?.mensaje || err.message || 'No se pudo eliminar la categoría.';
      avisar(msg, '');
    }
  }

  return (
    <GestionCategoriasAdmin
      categorias={contarPorCategoria(productos, categorias)}
      nuevoNombre={nuevoNombre}
      error={error}
      mensaje={mensaje}
      editando={editando}
      valorEdicion={valorEdicion}
      onCambiarNuevo={setNuevoNombre}
      onAgregar={agregar}
      onEditar={empezarEdicion}
      onCambiarEdicion={setValorEdicion}
      onGuardarEdicion={guardarEdicion}
      onCancelarEdicion={cancelarEdicion}
      onEliminar={eliminar}
    />
  );
}

export default AdminCategoriasContainer;