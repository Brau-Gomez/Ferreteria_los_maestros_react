// Container del detalle de producto del admin: busca el producto por código,
// decide permisos según el perfil y elimina con confirmación via API.
// Solo renderiza DetalleProductoAdmin o el aviso de producto no encontrado.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AvisoNoEncontradoAdmin from '@/components/organisms/admin/AvisoNoEncontradoAdmin.jsx';
import DetalleProductoAdmin from '@/components/organisms/admin/DetalleProductoAdmin.jsx';
import { useProductos } from '@/hooks/useProductos.js';
import { useSesion } from '@/hooks/useSesion.js';
import { useEliminarProducto } from '@/hooks/useProductos.js';

function AdminProductoDetalleContainer() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { productos, isLoading, refetch } = useProductos();
  const { usuario } = useSesion();
  const [error, setError] = useState('');
  const eliminarProductoMutation = useEliminarProducto();

  const producto = productos.find((item) => item.codigo === (codigo || '').toUpperCase());

  // Mientras se cargan los productos no hay nada que mostrar todavía.
  if (isLoading) {
    return null;
  }

  if (!producto) {
    return (
      <AvisoNoEncontradoAdmin
        titulo="Producto no encontrado"
        texto="Vuelve al listado para seleccionar una referencia existente."
        ruta="/admin/productos"
        etiquetaRuta="Volver a productos"
      />
    );
  }

  async function eliminar() {
    if (!window.confirm(`¿Eliminar el producto ${producto.codigo}?`)) return;
    try {
      setError('');
      await eliminarProductoMutation.mutateAsync(producto.codigo);
      // La invalidación de cache hará que se refresque la lista
      await refetch();
      navigate('/admin/productos');
    } catch (err) {
      const msg = err.response?.data?.mensaje || err.message || 'No fue posible eliminar el producto.';
      setError(msg);
    }
  }

  return (
    <DetalleProductoAdmin
      producto={producto}
      esAdmin={usuario?.tipoUsuario === 'Administrador'}
      error={error}
      onEliminar={eliminar}
    />
  );
}

export default AdminProductoDetalleContainer;