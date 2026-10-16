// Contacto porta el formulario y los datos de tienda desde tienda/contacto.html.
import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { validarContacto } from '../utils/validaciones/contacto.js';

const inicial = { nombre: '', correo: '', comentario: '' };

function Contacto() {
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [intentoEnviar, setIntentoEnviar] = useState(false);

  function actualizar(campo, valor) {
    const siguientes = { ...datos, [campo]: valor };
    setDatos(siguientes);
    if (intentoEnviar) setErrores(validarContacto(siguientes));
    setMensaje('');
  }

  function alEnviar(evento) {
    evento.preventDefault();
    const actuales = validarContacto(datos);
    setIntentoEnviar(true);
    setErrores(actuales);
    if (Object.values(actuales).some(Boolean)) return;

    setDatos(inicial);
    setErrores({});
    setMensaje('Consulta registrada para esta demostración. No se envía a un servidor.');
    setIntentoEnviar(false);
  }

  return (
    <Container className="py-5">
      <header className="mb-4">
        <p className="eyebrow mb-2">Estamos para ayudarte</p>
        <h1 className="titulo-seccion mb-2">Contacto</h1>
        <p>Completa el formulario para registrar tu consulta.</p>
      </header>

      <Row className="g-4 contacto-grid">
        <Col lg={7}>
          <Card className="contacto-formulario">
            <Card.Body className="p-4">
              <Form noValidate onSubmit={alEnviar}>
                <Form.Group className="mb-3" controlId="contacto-nombre">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    required
                    maxLength={100}
                    placeholder="Ej: Juan Pérez González"
                    value={datos.nombre}
                    isInvalid={Boolean(errores.nombre)}
                    onChange={(evento) => actualizar('nombre', evento.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="contacto-correo">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    maxLength={100}
                    placeholder="Ej: nombre@duocuc.cl"
                    value={datos.correo}
                    isInvalid={Boolean(errores.correo)}
                    onChange={(evento) => actualizar('correo', evento.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="contacto-comentario">
                  <Form.Label>Comentario</Form.Label>
                  <Form.Control
                    as="textarea"
                    required
                    maxLength={500}
                    rows={5}
                    placeholder="Cuéntanos tu consulta"
                    value={datos.comentario}
                    isInvalid={Boolean(errores.comentario)}
                    onChange={(evento) => actualizar('comentario', evento.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">{errores.comentario}</Form.Control.Feedback>
                </Form.Group>

                {mensaje && (
                  <Alert variant="success" role="status">
                    {mensaje}
                  </Alert>
                )}
                <Button type="submit" variant="warning" className="w-100">
                  Enviar consulta
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <aside className="contacto-datos h-100" aria-label="Datos de la ferretería">
            <h2>Visítanos o llámanos</h2>
            <section className="contacto-dato">
              <h3>Horario de atención</h3>
              <p>Lunes a viernes: 8:30 a 19:00</p>
              <p>Sábado: 9:00 a 14:00</p>
              <p>Domingo y festivos: cerrado</p>
            </section>
            <section className="contacto-dato">
              <h3>Dirección</h3>
              <p>Av. Francisco de Aguirre 1234</p>
              <p>La Serena, Región de Coquimbo</p>
            </section>
            <section className="contacto-dato">
              <h3>Teléfono</h3>
              <p><a href="tel:+56512345678">+56 51 234 5678</a></p>
            </section>
            <section className="contacto-dato mb-0">
              <h3>Correo</h3>
              <p><a href="mailto:contacto@losmaestros.cl">contacto@losmaestros.cl</a></p>
            </section>
          </aside>
        </Col>
      </Row>
    </Container>
  );
}

export default Contacto;
