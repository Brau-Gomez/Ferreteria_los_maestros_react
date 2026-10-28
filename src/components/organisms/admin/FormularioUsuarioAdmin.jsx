// Formulario de usuario del panel admin (crear y editar). Presentacional:
// el estado, la validación y el guardado viven en AdminUsuarioFormContainer.
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function FormularioUsuarioAdmin({
  modo, datos, errores, mensaje, roles, regiones, comunas, rutaCancelar,
  onCambiar, onCambiarRegion, onNormalizarRun, onEnviar,
}) {
  function campo(nombre, etiqueta, opciones = {}) {
    return (
      <Form.Group className="mb-3" controlId={`admin-usuario-${nombre}`}>
        <Form.Label>{etiqueta}</Form.Label>
        <Form.Control
          value={datos[nombre]}
          isInvalid={Boolean(errores[nombre])}
          onChange={(evento) => onCambiar(nombre, evento.target.value)}
          {...opciones}
        />
        <Form.Control.Feedback type="invalid">{errores[nombre]}</Form.Control.Feedback>
      </Form.Group>
    );
  }

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="admin-kicker"><Link to="/admin/usuarios">Usuarios</Link> / {modo === 'editar' ? 'Editar' : 'Nuevo'}</p>
          <h1>{modo === 'editar' ? 'Editar usuario' : 'Nuevo usuario'}</h1>
          <p>Los perfiles se guardan en este navegador y pueden ingresar con la clave demo123.</p>
        </div>
      </header>
      <Card className="admin-panel"><Card.Body>
        <Form noValidate onSubmit={onEnviar}>
          <Row>
            <Col md={6}>{campo('run', 'RUN *', { required: true, minLength: 7, maxLength: 9, placeholder: '123456785', onBlur: onNormalizarRun })}</Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="admin-usuario-tipoUsuario">
                <Form.Label>Tipo de usuario *</Form.Label>
                <Form.Select value={datos.tipoUsuario} isInvalid={Boolean(errores.tipoUsuario)} onChange={(evento) => onCambiar('tipoUsuario', evento.target.value)}>
                  <option value="">Selecciona un perfil</option>
                  {roles.map((rol) => <option key={rol}>{rol}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errores.tipoUsuario}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>{campo('nombre', 'Nombre *', { required: true, maxLength: 50 })}</Col>
            <Col md={6}>{campo('apellidos', 'Apellidos *', { required: true, maxLength: 100 })}</Col>
            <Col md={6}>{campo('correo', 'Correo *', { type: 'email', required: true, maxLength: 100 })}</Col>
            <Col md={6}>{campo('fechaNacimiento', 'Fecha de nacimiento', { type: 'date' })}</Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="admin-usuario-region">
                <Form.Label>Región *</Form.Label>
                <Form.Select value={datos.region} isInvalid={Boolean(errores.region)} onChange={(evento) => onCambiarRegion(evento.target.value)}>
                  {regiones.map((region) => <option key={region}>{region}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="admin-usuario-comuna">
                <Form.Label>Comuna *</Form.Label>
                <Form.Select value={datos.comuna} isInvalid={Boolean(errores.comuna)} onChange={(evento) => onCambiar('comuna', evento.target.value)}>
                  <option value="">Selecciona una comuna</option>
                  {comunas.map((comuna) => <option key={comuna}>{comuna}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12}>{campo('direccion', 'Dirección *', { as: 'textarea', rows: 2, required: true, maxLength: 300 })}</Col>
          </Row>
          {mensaje && <Alert variant="danger" role="alert">{mensaje}</Alert>}
          <div className="admin-form-footer">
            <Button type="submit">{modo === 'editar' ? 'Guardar cambios' : 'Guardar usuario'}</Button>
            <Button as={Link} to={rutaCancelar} variant="outline-primary">Cancelar</Button>
          </div>
        </Form>
      </Card.Body></Card>
    </>
  );
}

export default FormularioUsuarioAdmin;