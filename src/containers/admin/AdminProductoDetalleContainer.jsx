// Container del detalle de producto del admin: busca el producto por código,
// decide permisos según el perfil y elimina con confirmación.
// Solo renderiza DetalleProductoAdmin o el aviso de producto no encontrado.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AvisoNoEncontradoAdmin from '@/components/organisms/admin/AvisoNoEncontradoAdmin.jsx';
import DetalleProductoAdmin from '@/components/organisms/admin/DetalleProductoAdmin.jsx';
import { useProductos } from '@/hooks/useProductos.js';
import { useSesion } from '@/hooks/useSesion.js';
import { clavesDatos, eliminarRegistro, leerListaGuardada, obtenerProductos } from '@/services/almacenamiento.js';

function AdminProductoDetalleContainer() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { productos } = useProductos();
  const { usuario } = useSesion();
  const [error, setError] = useState('');
  const producto = productos.find((item) => item.codigo === (codigo || '').toUpperCase());

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

  function eliminar() {
    if (!window.confirm(`¿Eliminar el producto ${producto.codigo}?`)) return;
    const lista = leerListaGuardada(clavesDatos.productos) || obtenerProductos();
    if (!eliminarRegistro(clavesDatos.productos, lista, 'codigo', producto.codigo)) {
      setError('No fue posible eliminar el producto. Puedes reintentarlo.');
      return;
    }
    navigate('/admin/productos');
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