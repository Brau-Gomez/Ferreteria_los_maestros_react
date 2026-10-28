// Aviso reutilizable del panel cuando un registro (producto, usuario) no existe.
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

function AvisoNoEncontradoAdmin({ titulo, texto, ruta, etiquetaRuta }) {
  return (
    <Alert variant="warning">
      <h1>{titulo}</h1>
      <p>{texto}</p>
      <Link to={ruta}>{etiquetaRuta}</Link>
    </Alert>
  );
}

export default AvisoNoEncontradoAdmin;