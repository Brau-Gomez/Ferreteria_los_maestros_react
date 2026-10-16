// Formulario compartido para crear/editar productos del catálogo local.
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { categoriasProducto } from '../data/categorias.js';
import { clavesDatos, guardarRegistro, obtenerProductos } from '../services/almacenamiento.js';
import { validarProducto } from '../utils/validaciones/productos.js';

const vacio = {
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  stockCritico: '',
  categoria: '',
};

function leerImagen(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result);
    lector.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    lector.readAsDataURL(archivo);
  });
}

function AdminProductoForm({ modo }) {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [productos] = useState(() => obtenerProductos());
  const codigoOriginal = modo === 'editar' ? (codigo || '').toUpperCase() : '';
  const producto = productos.find((item) => item.codigo === codigoOriginal);
  const [datos, setDatos] = useState(() => producto ? {
    codigo: producto.codigo,
    nombre: producto.nombre,
    descripcion: producto.descripcion || '',
    precio: String(producto.precioVenta),
    stock: String(producto.stock),
    stockCritico: String(producto.stockMinimo),
    categoria: producto.categoria || '',
  } : vacio);
  const [archivo, setArchivo] = useState(null);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  if (modo === 'editar' && !producto) {
    return <Alert variant="warning"><h1>Producto no encontrado</h1><p>No se encontró el producto solicitado.</p><Link to="/admin/productos">Volver al listado</Link></Alert>;
  }

  function actualizar(campo, valor) {
    setDatos((previos) => ({ ...previos, [campo]: valor }));
    setMensaje('');
  }

  async function alEnviar(evento) {
    evento.preventDefault();
    const normalizados = { ...datos, codigo: datos.codigo.trim().toUpperCase() };
    const listaActual = obtenerProductos();
    const actuales = validarProducto(normalizados, listaActual, codigoOriginal, archivo);
    setErrores(actuales);
    if (Object.values(actuales).some(Boolean)) return;

    setGuardando(true);
    setMensaje('');
    try {
      const imagen = archivo ? await leerImagen(archivo) : producto?.imagen || '';
      const listaFinal = obtenerProductos();
      const erroresFinales = validarProducto(normalizados, listaFinal, codigoOriginal, archivo);
      setErrores(erroresFinales);
      if (Object.values(erroresFinales).some(Boolean)) {
        setMensaje('Revisa los campos antes de guardar.');
        return;
      }
      const actualizado = {
        ...(producto || {}),
        codigo: normalizados.codigo,
        nombre: normalizados.nombre.trim(),
        descripcion: normalizados.descripcion.trim(),
        precioVenta: Number(normalizados.precio),
        stock: Number(normalizados.stock),
        stockMinimo: normalizados.stockCritico === '' ? 0 : Number(normalizados.stockCritico),
        categoria: normalizados.categoria,
        subcategoria: producto?.subcategoria || '',
        marca: producto?.marca || '',
        unidad: producto?.unidad || '',
        imagen,
      };
      if (!guardarRegistro(clavesDatos.productos, listaFinal, 'codigo', codigoOriginal, actualizado)) {
        setMensaje('No fue posible guardar el producto. Puedes reintentarlo.');
        return;
      }
      navigate(`/admin/productos/${encodeURIComponent(actualizado.codigo)}`);
    } catch (error) {
      setMensaje(error.message || 'No fue posible guardar el producto. Puedes reintentarlo.');
    } finally {
      setGuardando(false);
    }
  }

  function campo(nombre, etiqueta, opciones = {}) {
    const { tipo = 'text', ...props } = opciones;
    return (
      <Form.Group className="mb-3" controlId={`admin-producto-${nombre}`}>
        <Form.Label>{etiqueta}</Form.Label>
        <Form.Control
          type={tipo}
          value={datos[nombre]}
          isInvalid={Boolean(errores[nombre])}
          onChange={(evento) => actualizar(nombre, evento.target.value)}
          {...props}
        />
        <Form.Control.Feedback type="invalid">{errores[nombre]}</Form.Control.Feedback>
      </Form.Group>
    );
  }

  return (
    <>
      <header className="admin-page-heading">
        <div><p className="admin-kicker"><Link to="/admin/productos">Productos</Link> / {modo === 'editar' ? 'Editar' : 'Nuevo'}</p><h1>{modo === 'editar' ? 'Editar producto' : 'Nuevo producto'}</h1><p>Los cambios se guardan en el catálogo local de este navegador.</p></div>
      </header>
      <Card className="admin-panel"><Card.Body>
        <Form noValidate onSubmit={alEnviar}>
          <Row>
            <Col md={6}>{campo('codigo', 'Código *', { required: true, minLength: 3, onBlur: (evento) => actualizar('codigo', evento.target.value.toUpperCase()) })}</Col>
            <Col md={6}>{campo('nombre', 'Nombre *', { required: true, maxLength: 100 })}</Col>
            <Col xs={12}><Form.Group className="mb-3" controlId="admin-producto-descripcion"><Form.Label>Descripción</Form.Label><Form.Control as="textarea" rows={3} maxLength={500} value={datos.descripcion} isInvalid={Boolean(errores.descripcion)} onChange={(evento) => actualizar('descripcion', evento.target.value)} /><Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback></Form.Group></Col>
            <Col md={4}>{campo('precio', 'Precio de venta *', { tipo: 'number', min: 0, step: 'any', required: true })}</Col>
            <Col md={4}>{campo('stock', 'Stock *', { tipo: 'number', min: 0, step: 1, required: true })}</Col>
            <Col md={4}>{campo('stockCritico', 'Stock crítico', { tipo: 'number', min: 0, step: 1 })}</Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="admin-producto-categoria">
                <Form.Label>Categoría *</Form.Label>
                <Form.Select value={datos.categoria} isInvalid={Boolean(errores.categoria)} onChange={(evento) => actualizar('categoria', evento.target.value)}>
                  <option value="">Selecciona una categoría</option>
                  {categoriasProducto.map((categoria) => <option key={categoria}>{categoria}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errores.categoria}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group className="mb-3" controlId="admin-producto-imagen">
                <Form.Label>{modo === 'editar' ? 'Reemplazar imagen' : 'Imagen'}</Form.Label>
                <Form.Control type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" isInvalid={Boolean(errores.imagen)} onChange={(evento) => { setArchivo(evento.target.files[0] || null); setMensaje(''); }} />
                <Form.Text>{producto?.imagen ? 'Imagen actual conservada si no seleccionas otra.' : 'Opcional, máximo 500 KB.'}</Form.Text>
                <Form.Control.Feedback type="invalid">{errores.imagen}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          {mensaje && <Alert variant="danger" role="alert">{mensaje}</Alert>}
          <div className="admin-form-footer">
            <Button type="submit" disabled={guardando}>{guardando ? 'Guardando…' : modo === 'editar' ? 'Guardar cambios' : 'Guardar producto'}</Button>
            <Button as={Link} to={producto ? `/admin/productos/${encodeURIComponent(producto.codigo)}` : '/admin/productos'} variant="outline-primary">Cancelar</Button>
          </div>
        </Form>
      </Card.Body></Card>
    </>
  );
}

export default AdminProductoForm;
