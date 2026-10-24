// Container del resumen admin: calcula las métricas del catálogo y los
// usuarios. Solo renderiza ResumenAdmin.
import { useState } from 'react';
import ResumenAdmin from '../components/organisms/ResumenAdmin.jsx';
import { useProductos } from '../hooks/useProductos.js';
import { obtenerUsuarios } from '../services/almacenamiento.js';
import { productosCriticos } from '../utils/admin.js';

function AdminInicioContainer() {
  const { productos } = useProductos();
  const [usuarios] = useState(() => obtenerUsuarios());
  return (
    <ResumenAdmin
      totalProductos={productos.length}
      totalUsuarios={usuarios.length}
      totalCriticos={productosCriticos(productos).length}
    />
  );
}

export default AdminInicioContainer;