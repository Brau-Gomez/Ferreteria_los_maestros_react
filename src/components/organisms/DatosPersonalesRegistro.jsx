// Bloque "Datos personales" del registro. Presentacional: recibe los datos,
// los errores, las comunas disponibles y avisa con onCambio(campo, valor).
import Form from 'react-bootstrap/Form';
import CampoFormulario from '../molecules/CampoFormulario.jsx';

function DatosPersonalesRegistro({ datos, errores, region, comunas, onCambio }) {
  function alCambiar(campo) {
    return (evento) => onCambio(campo, evento.target.value);
  }

  return (
    <fieldset className="registro-bloque mb-4">
      <legend>Datos personales</legend>
      <div className="row">
        <div className="col-md-6">
          <CampoFormulario
            id="registro-nombre"
            required
            etiqueta="Nombre *"
            error={errores.nombre}
            maxLength={50}
            value={datos.nombre}
            onChange={alCambiar('nombre')}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="registro-apellidos"
            required
            etiqueta="Apellidos *"
            error={errores.apellidos}
            maxLength={100}
            value={datos.apellidos}
            onChange={alCambiar('apellidos')}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="registro-run"
            required
            etiqueta="RUN *"
            error={errores.run}
            ayuda="Sin puntos ni guion."
            minLength={7}
            maxLength={9}
            placeholder="123456785"
            value={datos.run}
            onChange={alCambiar('run')}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="registro-fechaNacimiento"
            etiqueta="Fecha de nacimiento"
            error={errores.fechaNacimiento}
            type="date"
            value={datos.fechaNacimiento}
            onChange={alCambiar('fechaNacimiento')}
          />
        </div>
        <div className="col-md-6">
          <Form.Label>Región</Form.Label>
          <Form.Control value={region} readOnly aria-label="Región de residencia" />
        </div>
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="registro-comuna">
            <Form.Label>Comuna *</Form.Label>
            <Form.Select
              value={datos.comuna}
              isInvalid={Boolean(errores.comuna)}
              onChange={alCambiar('comuna')}
            >
              <option value="">Selecciona una comuna</option>
              {comunas.map((comuna) => (
                <option key={comuna} value={comuna}>{comuna}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col-12">
          <CampoFormulario
            id="registro-direccion"
            required
            etiqueta="Dirección *"
            error={errores.direccion}
            ayuda="Se usará como dirección de despacho."
            as="textarea"
            maxLength={300}
            value={datos.direccion}
            onChange={alCambiar('direccion')}
          />
        </div>
      </div>
    </fieldset>
  );
}

export default DatosPersonalesRegistro;