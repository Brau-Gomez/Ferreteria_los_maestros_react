// Container de la boleta: busca la orden por id (de la URL), su cliente y
// calcula el desglose de IVA. Solo renderiza BoletaAdmin.
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import BoletaAdmin from '../components/organisms/BoletaAdmin.jsx';
import { clavesDatos, leerListaGuardada, obtenerUsuarios } from '../services/almacenamiento.js';
import { buscarPedido, desgloseIva, nombreCliente } from '../utils/boleta.js';
import { fechaDesdeMarca, marcaPedido } from '../utils/cuenta.js';

function AdminOrdenDetalleContainer() {
  const { id } = useParams();
  const [pedidos] = useState(() => leerListaGuardada(clavesDatos.pedidos) || []);
  const [usuarios] = useState(() => obtenerUsuarios());
  const pedido = buscarPedido(pedidos, id);

  const boleta = pedido && {
    pedido,
    cliente: nombreCliente(usuarios, pedido.runUsuario),
    fecha: fechaDesdeMarca(marcaPedido(pedido.id)),
    desglose: desgloseIva(pedido.total),
  };

  return <BoletaAdmin boleta={boleta} onImprimir={() => window.print()} />;
}

export default AdminOrdenDetalleContainer;