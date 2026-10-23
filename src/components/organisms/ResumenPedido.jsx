// Resumen del pedido: total, tipo de entrega y botón de confirmar.
// Presentacional: el tipo de entrega y el envío los controla el container.
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { formatearDinero } from '../../utils/dinero.js';

const opcionesEntrega = [
  { id: 'retiro-tienda', valor: 'Retiro en tienda' },
  { id: 'despacho', valor: 'Despacho' },
];

function ResumenPedido({ total, entrega, onCambiarEntrega, onConfirmar }) {
  return (
    <Card className="resumen-pedido">
      <Card.Body>
        <h2 className="h4">Resumen del pedido</h2>
        <p className="total-resumen">
          Total <strong>{formatearDinero(total)}</strong>
        </p>
        <Form onSubmit={onConfirmar}>
          <fieldset>
            <legend className="fs-6">Tipo de entrega</legend>
            {opcionesEntrega.map((opcion) => (
              <Form.Check
                key={opcion.id}
                type="radio"
                id={opcion.id}
                name="entrega"
                value={opcion.valor}
                label={opcion.valor}
                checked={entrega === opcion.valor}
                onChange={(evento) => onCambiarEntrega(evento.target.value)}
              />
            ))}
          </fieldset>
          <Button type="submit" variant="warning" className="w-100">
            Confirmar pedido
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ResumenPedido;