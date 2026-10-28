// Container del listado de órdenes: lee pedidos y usuarios guardados y arma
// las filas (fecha, cliente, estado, total). Solo renderiza ListadoOrdenesAdmin.
import { useState } from 'react';
import ListadoOrdenesAdmin from '@/components/organisms/admin/ListadoOrdenesAdmin.jsx';
import { clavesDatos, leerListaGuardada, obtenerUsuarios } from '@/services/almacenamiento.js';
import { nombreCliente, ordenarPedidos } from '@/utils/boleta.js';
import { fechaDesdeMarca, marcaPedido } from '@/utils/cuenta.js';
import { estadoPedido } from '@/utils/estadoPedido.js';

function AdminOrdenesContainer() {
  const [pedidos] = useState(() => leerListaGuardada(clavesDatos.pedidos) || []);
  const [usuarios] = useState(() => obtenerUsuarios());

  const ordenes = ordenarPedidos(pedidos).map((pedido) => ({
    id: pedido.id,
    fecha: fechaDesdeMarca(marcaPedido(pedido.id)),
    cliente: nombreCliente(usuarios, pedido.runUsuario),
    entrega: pedido.delivery,
    estado: estadoPedido(pedido),
    total: Number(pedido.total) || 0,
  }));

  return <ListadoOrdenesAdmin ordenes={ordenes} />;
}

export default AdminOrdenesContainer;