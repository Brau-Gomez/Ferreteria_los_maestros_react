// Formulario de producto del panel admin (crear y editar). Presentacional:
// el estado, la validación y el guardado viven en AdminProductoFormContainer.
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function FormularioProductoAdmin({
  modo, datos, errores, mensaje, guardando, categorias, tieneImagen, rutaCancelar,
  onCambiar, onArchivo, onEnviar,
}) {
  function campo(nombre, etiqueta, opciones = {}) {
    const { tipo = 'text', ...props } = opciones;
    return (
      <Form.Group className="mb-3" controlId={`admin-producto-${nombre}`}>
        <Form.Label>{etiqueta}</Form.Label>
        <Form.Control
          type={tipo}
          value={datos[nombre]}
          isInvalid={Boolean(errores[nombre])}
          onChange={(evento) => onCambiar(nombre, evento.target.value)}
          {...props}
        />
        <Form.Control.Feedback type="invalid">{errores[nombre]}</Form.Control.Feedback>
      </Form.Group>
    );
  }

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="admin-kicker"><Link to="/admin/productos">Productos</Link> / {modo === 'editar' ? 'Editar' : 'Nuevo'}</p>
          <h1>{modo === 'editar' ? 'Editar producto' : 'Nuevo producto'}</h1>
          <p>Los cambios se guardan en el catálogo local de este navegador.</p>
        </div>
      </header>
      <Card className="admin-panel"><Card.Body>
        <Form noValidate onSubmit={onEnviar}>
          <Row>
            <Col md={6}>{campo('codigo', 'Código *', { required: true, minLength: 3, onBlur: (evento) => onCambiar('codigo', evento.target.value.toUpperCase()) })}</Col>
            <Col md={6}>{campo('nombre', 'Nombre *', { required: true, maxLength: 100 })}</Col>
            <Col xs={12}>
              <Form.Group className="mb-3" controlId="admin-producto-descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" rows={3} maxLength={500} value={datos.descripcion} isInvalid={Boolean(errores.descripcion)} onChange={(evento) => onCambiar('descripcion', evento.target.value)} />
                <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>{campo('precio', 'Precio de venta *', { tipo: 'number', min: 0, step: 'any', required: true })}</Col>
            <Col md={4}>{campo('stock', 'Stock *', { tipo: 'number', min: 0, step: 1, required: true })}</Col>
            <Col md={4}>{campo('stockCritico', 'Stock crítico', { tipo: 'number', min: 0, step: 1 })}</Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="admin-producto-categoria">
                <Form.Label>Categoría *</Form.Label>
                <Form.Select value={datos.categoria} isInvalid={Boolean(errores.categoria)} onChange={(evento) => onCambiar('categoria', evento.target.value)}>
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((categoria) => <option key={categoria}>{categoria}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errores.categoria}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group className="mb-3" controlId="admin-producto-imagen">
                <Form.Label>{modo === 'editar' ? 'Reemplazar imagen' : 'Imagen'}</Form.Label>
                <Form.Control type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" isInvalid={Boolean(errores.imagen)} onChange={(evento) => onArchivo(evento.target.files[0] || null)} />
                <Form.Text>{tieneImagen ? 'Imagen actual conservada si no seleccionas otra.' : 'Opcional, máximo 500 KB.'}</Form.Text>
                <Form.Control.Feedback type="invalid">{errores.imagen}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          {mensaje && <Alert variant="danger" role="alert">{mensaje}</Alert>}
          <div className="admin-form-footer">
            <Button type="submit" disabled={guardando}>{guardando ? 'Guardando…' : modo === 'editar' ? 'Guardar cambios' : 'Guardar producto'}</Button>
            <Button as={Link} to={rutaCancelar} variant="outline-primary">Cancelar</Button>
          </div>
        </Form>
      </Card.Body></Card>
    </>
  );
}

export default FormularioProductoAdmin;