import Form from 'react-bootstrap/Form';

// Campo de formulario reutilizable: etiqueta, control y mensaje de error.
// `ayuda` es un texto opcional bajo el control; el resto de las propiedades
// (type, value, onChange, maxLength...) pasa directo al Form.Control.
function CampoFormulario({ id, etiqueta, error, ayuda, ...propsControl }) {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{etiqueta}</Form.Label>
      <Form.Control isInvalid={Boolean(error)} {...propsControl} />
      {ayuda && <Form.Text>{ayuda}</Form.Text>}
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}

export default CampoFormulario;