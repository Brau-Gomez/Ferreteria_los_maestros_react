// Resumen de compra del checkout: productos, cantidades, subtotales y total.
// Presentacional: solo muestra lo que recibe.
import Card from 'react-bootstrap/Card';
import { formatearDinero } from '../../utils/dinero.js';

function ResumenCompra({ items, total }) {
  return (
    <Card className="resumen-pedido">
      <Card.Body>
        <h2 className="h4">Resumen de compra</h2>
        <ul className="list-unstyled mb-3">
          {items.map((item) => (
            <li key={item.codigo} className="d-flex justify-content-between gap-2 mb-2">
              <span>
                {item.nombre} <small className="text-muted">× {item.cantidad}</small>
              </span>
              <span>{formatearDinero(item.precioVenta * item.cantidad)}</span>
            </li>
          ))}
        </ul>
        <p className="total-resumen mb-0">
          Total <strong>{formatearDinero(total)}</strong>
        </p>
      </Card.Body>
    </Card>
  );
}

export default ResumenCompra;