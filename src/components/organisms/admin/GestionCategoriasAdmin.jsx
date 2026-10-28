// Gestión de categorías del panel admin. Presentacional: todo el estado
// y las acciones llegan desde AdminCategoriasContainer.
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

function GestionCategoriasAdmin({
  categorias, nuevoNombre, error, mensaje, editando, valorEdicion,
  onCambiarNuevo, onAgregar, onEditar, onCambiarEdicion, onGuardarEdicion, onCancelarEdicion, onEliminar,
}) {
  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="admin-kicker">Catálogo</p>
          <h1>Categorías</h1>
          <p>Crea, renombra o elimina las categorías de la tienda.</p>
        </div>
      </header>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <section className="admin-panel mb-4" aria-labelledby="titulo-nueva-categoria">
        <h2 id="titulo-nueva-categoria" className="h5">Nueva categoría</h2>
        <Form className="d-flex gap-2 flex-wrap" onSubmit={(evento) => { evento.preventDefault(); onAgregar(); }}>
          <Form.Group controlId="categoria-nueva" className="flex-grow-1">
            <Form.Label visuallyHidden>Nombre de la nueva categoría</Form.Label>
            <Form.Control value={nuevoNombre} placeholder="Nombre de la categoría" onChange={(evento) => onCambiarNuevo(evento.target.value)} />
          </Form.Group>
          <Button type="submit" variant="warning">Agregar categoría</Button>
        </Form>
      </section>
      <section className="admin-panel" aria-labelledby="titulo-lista-categorias">
        <div className="admin-panel-header">
          <div>
            <h2 id="titulo-lista-categorias">Categorías registradas</h2>
            <p>{categorias.length} categorías en este navegador.</p>
          </div>
        </div>
        <div className="admin-table-wrap">
          <Table responsive hover className="admin-table mb-0">
            <thead>
              <tr><th scope="col">Categoría</th><th scope="col">Productos</th><th scope="col">Acciones</th></tr>
            </thead>
            <tbody>
              {categorias.map((fila) => (
                <tr key={fila.categoria}>
                  <td>
                    {editando === fila.categoria ? (
                      <Form.Control
                        aria-label={`Nuevo nombre para ${fila.categoria}`}
                        value={valorEdicion}
                        onChange={(evento) => onCambiarEdicion(evento.target.value)}
                      />
                    ) : fila.categoria}
                  </td>
                  <td>{fila.cantidad}</td>
                  <td>
                    {editando === fila.categoria ? (
                      <>
                        <Button size="sm" variant="primary" className="me-2" onClick={onGuardarEdicion}>Guardar</Button>
                        <Button size="sm" variant="outline-secondary" onClick={onCancelarEdicion}>Cancelar</Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline-primary" className="me-2" aria-label={`Editar ${fila.categoria}`} onClick={() => onEditar(fila.categoria)}>Editar</Button>
                        <Button size="sm" variant="outline-danger" aria-label={`Eliminar ${fila.categoria}`} onClick={() => onEliminar(fila.categoria)}>Eliminar</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {categorias.length === 0 && <tr><td colSpan="3">No hay categorías guardadas.</td></tr>}
            </tbody>
          </Table>
        </div>
      </section>
    </>
  );
}

export default GestionCategoriasAdmin;