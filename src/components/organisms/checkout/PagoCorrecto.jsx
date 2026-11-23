// Vista "Pago correcto": número de pedido y resumen de lo pagado.
// Presentacional.
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import { formatearDinero } from '@/utils/dinero.js';

function PagoCorrecto({ pedido }) {
  const boleta = pedido.boleta;
  return (
    <div className="sin-resultados">
      <Alert variant="success">Pago realizado correctamente.</Alert>
      <h1>Pedido {pedido.id}</h1>
      <p>
        Total pagado: <strong>{formatearDinero(pedido.total)}</strong>
      </p>
      <p>Entrega: {pedido.entrega}</p>
      <p>Enviamos el detalle a {pedido.correo}.</p>
      {boleta && (
        <section className="boleta-simulada">
          <h2>Boleta {boleta.folio}</h2>
          <p>{boleta.emisor} — {boleta.rutEmisor}</p>
          {boleta.fecha && <p>Fecha: {new Date(boleta.fecha).toLocaleString('es-CL')}</p>}
          <ul>
            {(boleta.items || []).map((item, indice) => (
              <li key={item.productCode ?? indice}>
                {item.productName || item.productCode} — {item.quantity} x{' '}
                {formatearDinero(Number(item.unitPrice) || 0)}
              </li>
            ))}
          </ul>
          <p>Neto: {formatearDinero(Number(boleta.neto) || 0)}</p>
          <p>IVA: {formatearDinero(Number(boleta.iva) || 0)}</p>
          <p>Despacho: {formatearDinero(Number(boleta.despacho) || 0)}</p>
          <p>Total boleta: {formatearDinero(Number(boleta.total) || 0)}</p>
          <p>Transacción: {boleta.transaccionId} ({boleta.estadoPago})</p>
        </section>
      )}
      <Link to="/cuenta">Ver mis pedidos</Link>
    </div>
  );
}

export default PagoCorrecto;