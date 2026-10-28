// Container de categorías del admin: valida, persiste y mantiene
// coherentes los productos (al renombrar) y el catálogo (al eliminar).
// Solo renderiza GestionCategoriasAdmin.
import { useState } from 'react';
import GestionCategoriasAdmin from '@/components/organisms/admin/GestionCategoriasAdmin.jsx';
import { clavesDatos, guardarDato, obtenerProductos } from '@/services/almacenamiento.js';
import { guardarCategorias, obtenerCategorias } from '@/services/categorias.js';
import { contarPorCategoria } from '@/utils/productos.js';
import { validarCategoria } from '@/utils/validaciones/categorias.js';

function AdminCategoriasContainer() {
  const [categorias, setCategorias] = useState(() => obtenerCategorias());
  const [productos, setProductos] = useState(() => obtenerProductos());
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [editando, setEditando] = useState('');
  const [valorEdicion, setValorEdicion] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  function avisar(nuevoError, nuevoMensaje) {
    setError(nuevoError);
    setMensaje(nuevoMensaje);
  }

  function agregar() {
    const problema = validarCategoria(nuevoNombre, categorias);
    if (problema) return avisar(problema, '');
    const nombre = nuevoNombre.trim();
    const lista = [...categorias, nombre];
    if (!guardarCategorias(lista)) return avisar('No se pudo guardar la categoría.', '');
    setCategorias(lista);
    setNuevoNombre('');
    avisar('', `Categoría "${nombre}" creada.`);
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

  function guardarEdicion() {
    const problema = validarCategoria(valorEdicion, categorias, editando);
    if (problema) return avisar(problema, '');
    const nombre = valorEdicion.trim();
    const lista = categorias.map((categoria) => (categoria === editando ? nombre : categoria));
    if (!guardarCategorias(lista)) return avisar('No se pudo guardar la categoría.', '');
    // Los productos que usaban el nombre anterior pasan al nuevo.
    const actualizados = productos.map((producto) =>
      producto.categoria === editando ? { ...producto, categoria: nombre } : producto,
    );
    guardarDato(clavesDatos.productos, actualizados);
    setProductos(actualizados);
    setCategorias(lista);
    setEditando('');
    setValorEdicion('');
    avisar('', `Categoría renombrada a "${nombre}".`);
  }

  function eliminar(nombre) {
    const usados = productos.filter((producto) => producto.categoria === nombre).length;
    if (usados > 0) {
      return avisar(`No se puede eliminar "${nombre}": tiene ${usados} producto(s) asociados.`, '');
    }
    if (!window.confirm(`¿Eliminar la categoría "${nombre}"?`)) return undefined;
    const lista = categorias.filter((categoria) => categoria !== nombre);
    if (!guardarCategorias(lista)) return avisar('No se pudo eliminar la categoría.', '');
    setCategorias(lista);
    return avisar('', `Categoría "${nombre}" eliminada.`);
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