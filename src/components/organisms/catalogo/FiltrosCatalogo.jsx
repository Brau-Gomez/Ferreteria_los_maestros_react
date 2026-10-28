// Barra de filtros del catálogo. Presentacional: recibe los filtros actuales,
// las categorías disponibles y avisa cada cambio con onCambio(campo, valor).
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function FiltrosCatalogo({ filtros, categorias, onCambio }) {
  return (
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
              onChange={(evento) => onCambio('texto', evento.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6} lg={4}>
          <Form.Group controlId="filtro-categoria">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              value={filtros.categoria}
              onChange={(evento) => onCambio('categoria', evento.target.value)}
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
            onChange={(evento) => onCambio('soloStock', evento.target.checked)}
          />
        </Col>
      </Row>
    </Form>
  );
}

export default FiltrosCatalogo;