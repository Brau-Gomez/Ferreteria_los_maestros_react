// Campo de formulario reutilizable: etiqueta + control + mensaje de error.
// Es presentacional: no valida ni guarda estado; todo llega por props.
import Form from 'react-bootstrap/Form';

function CampoFormulario({ id, etiqueta, error, ...propsControl }) {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{etiqueta}</Form.Label>
      <Form.Control isInvalid={Boolean(error)} {...propsControl} />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}

export default CampoFormulario;