// Insignia de estado (Activo, Disponible, Stock crítico…). Átomo puro:
// solo recibe el color (variante de Bootstrap) y el texto.
import Badge from 'react-bootstrap/Badge';

function InsigniaEstado({ variante = 'secondary', children }) {
  return <Badge bg={variante}>{children}</Badge>;
}

export default InsigniaEstado;