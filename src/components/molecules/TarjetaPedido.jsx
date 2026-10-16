import { formatearDinero } from '../../utils/dinero.js';
import { fechaDesdeMarca, marcaPedido } from '../../utils/cuenta.js';

function TarjetaPedido({ pedido }) {
  const productos = Array.isArray(pedido.productos) ? pedido.productos : [];

  return (
    <article className="pedido-card">
      <div className="pedido-encabezado">
        <div>
          <h3>{pedido.id}</h3>
          <p className="pedido-fecha">{fechaDesdeMarca(marcaPedido(pedido.id))}</p>
        </div>
        <span className="pedido-entrega">{pedido.delivery}</span>
      </div>
      <ul className="pedido-lista">
        {productos.length ? productos.map((producto, indice) => (
          <li key={`${producto.codigo || producto.nombre}-${indice}`}>
            <span>{producto.nombre}</span>
            <span className="pedido-cantidad">x{producto.cantidad}</span>
            <span>{formatearDinero((Number(producto.precioVenta) || 0) * (Number(producto.cantidad) || 0))}</span>
          </li>
        )) : <li>Sin detalle de productos.</li>}
      </ul>
      <p className="pedido-total">
        Total <strong>{formatearDinero(Number(pedido.total) || 0)}</strong>
      </p>
    </article>
  );
}

export default TarjetaPedido;
