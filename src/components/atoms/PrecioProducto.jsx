// Precio de un producto. Átomo puro: si recibe un precio anterior mayor al
// actual, lo muestra tachado junto con la insignia de descuento.
import Badge from 'react-bootstrap/Badge';
import { formatearDinero } from '../../utils/dinero.js';

function PrecioProducto({ precio, precioAnterior, descuento }) {
  const enOferta = Number(precioAnterior) > Number(precio);
  return (
    <span className="precio-producto">
      {enOferta && (
        <>
          <Badge bg="danger" className="me-2">Oferta -{descuento}%</Badge>
          <del className="text-body-secondary fw-normal me-2">
            {formatearDinero(precioAnterior)}
          </del>
        </>
      )}
      {formatearDinero(precio)}
    </span>
  );
}

export default PrecioProducto;