// Formulario completo de registro: compone los bloques, el tipo de cuenta,
// el aviso y los botones. Presentacional: sin estado propio.
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import DatosAccesoRegistro from '@/components/organisms/registro/DatosAccesoRegistro.jsx';
import DatosEmpresaRegistro from '@/components/organisms/registro/DatosEmpresaRegistro.jsx';
import DatosPersonalesRegistro from '@/components/organisms/registro/DatosPersonalesRegistro.jsx';

function FormularioRegistro({
  datos,
  errores,
  mensaje,
  exito,
  enviando,
  region,
  comunas,
  onCambio,
  onEnviar,
}) {
  const esContratista = datos.tipoCuenta === 'Contratista';

  return (
    <Card className="auth-card">
      <Card.Body className="p-4 p-md-5">
        <Form noValidate onSubmit={onEnviar}>
          <DatosPersonalesRegistro
            datos={datos}
            errores={errores}
            region={region}
            comunas={comunas}
            onCambio={onCambio}
          />

          <fieldset className="registro-bloque mb-4">
            <legend>Tipo de cuenta</legend>
            <Form.Group controlId="registro-tipo-cuenta">
              <Form.Label>¿Cómo vas a comprar? *</Form.Label>
              <Form.Select
                value={datos.tipoCuenta}
                onChange={(evento) => onCambio('tipoCuenta', evento.target.value)}
              >
                <option value="Cliente">Cliente particular</option>
                <option value="Contratista">
                  Contratista o empresa (con cuenta corriente)
                </option>
              </Form.Select>
              <Form.Text>
                Los contratistas cargan sus compras a una cuenta corriente que
                se paga al cierre de cada mes.
              </Form.Text>
            </Form.Group>
          </fieldset>

          {esContratista && (
            <DatosEmpresaRegistro
              datos={datos}
              errores={errores}
              onCambio={onCambio}
            />
          )}

          <DatosAccesoRegistro
            datos={datos}
            errores={errores}
            onCambio={onCambio}
          />

          {mensaje && (
            <Alert variant={exito ? 'success' : 'danger'} role={exito ? 'status' : 'alert'}>
              {mensaje}
            </Alert>
          )}
          <div className="d-flex flex-wrap gap-2">
            <Button variant="warning" type="submit" disabled={enviando}>
              {enviando ? 'Creando cuenta…' : 'Registrarme'}
            </Button>
            <Button as={Link} to="/ingreso" variant="outline-primary">
              Iniciar sesión
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default FormularioRegistro;