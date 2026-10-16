// Formulario de contacto. Presentacional: los datos, los errores y las
// funciones llegan por props desde ContactoContainer.
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import CampoFormulario from '../molecules/CampoFormulario.jsx';

function FormularioContacto({ datos, errores, mensaje, onCambio, onEnviar }) {
  return (
    <Card className="auth-card">
      <Card.Body className="p-4">
        <Form noValidate onSubmit={onEnviar}>
          <CampoFormulario
            id="contacto-nombre"
            etiqueta="Nombre completo"
            type="text"
            maxLength={100}
            placeholder="Ej: Juan Pérez González"
            value={datos.nombre}
            error={errores.nombre}
            onChange={(evento) => onCambio('nombre', evento.target.value)}
          />

          <CampoFormulario
            id="contacto-correo"
            etiqueta="Correo electrónico"
            type="email"
            maxLength={100}
            placeholder="Ej: nombre@duocuc.cl"
            value={datos.correo}
            error={errores.correo}
            onChange={(evento) => onCambio('correo', evento.target.value)}
          />

          <CampoFormulario
            id="contacto-comentario"
            etiqueta="Comentario"
            as="textarea"
            rows={4}
            maxLength={500}
            placeholder="Cuéntanos tu consulta"
            value={datos.comentario}
            error={errores.comentario}
            onChange={(evento) => onCambio('comentario', evento.target.value)}
          />

          {mensaje && <Alert variant="success">{mensaje}</Alert>}

          <Button type="submit" variant="primary" className="w-100">
            Enviar consulta
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default FormularioContacto;