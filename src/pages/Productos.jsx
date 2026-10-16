// Catálogo de productos de la tienda.
// Porta tienda/catalogo.html + js/tienda/catalogo.js: encabezado con
// contador, barra de filtros en vivo y grilla de tarjetas.
//
// Reparto de responsabilidades:
// - filtrarProductos/categoriasPresentes (utils): lógica pura de filtros.
// - TarjetaProducto: cómo se ve cada producto.
// - CartContext (useCarrito): qué pasa al agregar al carrito.
// - Esta página: estado de los filtros y coordinación (lifting state up).
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useProductos } from '../hooks/useProductos.js';
import { useCarrito } from '../hooks/useCarrito.js';
import { categoriasPresentes, filtrarProductos } from '../utils/productos.js';
import TarjetaProducto from '../components/molecules/TarjetaProducto.jsx';

function Productos() {
  const { productos } = useProductos();
  const { agregar } = useCarrito();
  const [filtros, setFiltros] = useState({
    texto: '',
    categoria: 'Todas',
    soloStock: false,
  });
  // Aviso del último "Agregar" (antes #cart-status con mostrarMensaje()).
  const [aviso, setAviso] = useState(null);

  // Derivados: se recalculan en cada render, sin estado duplicado.
  const categorias = categoriasPresentes(productos);
  const visibles = filtrarProductos(productos, filtros);

  function cambiarFiltro(campo, valor) {
    setFiltros((previos) => ({ ...previos, [campo]: valor }));
  }

  // El CartContext valida stock y devuelve { ok, mensaje } para el aviso.
  function agregarDesdeCatalogo(codigo) {
    setAviso(agregar(codigo));
  }

  return (
    <Container className="py-5">
      <p className="eyebrow mb-2">Catálogo de materiales</p>
      <h1 className="titulo-seccion mb-3">Encuentra lo que necesites</h1>
      <p className="text-body-secondary mb-4">
        {visibles.length} productos · datos locales de demostración
      </p>

      {/* Barra de filtros (antes .filter-bar): filtran en vivo con cada
          tecla, como el listener "input" del original. */}
      <Form
        className="filtro-barra mb-4"
        onSubmit={(evento) => evento.preventDefault()}
      >
        <Row className="g-3 align-items-end">
          <Col md={6} lg={5}>
            <Form.Group controlId="filtro-busqueda">
              <Form.Label>Buscar por nombre, marca o código</Form.Label>
              <Form.Control
                type="search"
                placeholder="Ej.: taladro o HE001"
                value={filtros.texto}
                onChange={(evento) => cambiarFiltro('texto', evento.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6} lg={4}>
            <Form.Group controlId="filtro-categoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={filtros.categoria}
                onChange={(evento) =>
                  cambiarFiltro('categoria', evento.target.value)
                }
              >
                <option value="Todas">Todas</option>
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg={3}>
            <Form.Check
              type="checkbox"
              id="filtro-stock"
              label="Sólo con stock"
              className="pb-2"
              checked={filtros.soloStock}
              onChange={(evento) => cambiarFiltro('soloStock', evento.target.checked)}
            />
          </Col>
        </Row>
      </Form>

      {aviso && (
        <Alert
          variant={aviso.ok ? 'success' : 'danger'}
          dismissible
          className="mb-4"
          onClose={() => setAviso(null)}
        >
          {aviso.mensaje}
        </Alert>
      )}

      {/* Renderizado condicional: grilla o estado vacío (antes .empty). */}
      {visibles.length > 0 ? (
        <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
          {visibles.map((producto) => (
            <Col key={producto.codigo} className="d-flex">
              <TarjetaProducto
                producto={producto}
                onAgregar={agregarDesdeCatalogo}
                className="w-100"
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="sin-resultados">
          <h2>Sin resultados</h2>
          <p className="text-body-secondary mb-0">
            Prueba otra búsqueda o categoría.
          </p>
        </div>
      )}
    </Container>
  );
}

export default Productos;
