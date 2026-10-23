// Bloque "Datos de acceso" del registro: teléfono, correo y contraseña.
// Presentacional: recibe datos y errores; avisa con onCambio(campo, valor).
import CampoFormulario from '../molecules/CampoFormulario.jsx';

function DatosAccesoRegistro({ datos, errores, onCambio }) {
  function alCambiar(campo) {
    return (evento) => onCambio(campo, evento.target.value);
  }

  return (
    <fieldset className="registro-bloque mb-4">
      <legend>Datos de acceso</legend>
      <div className="row">
        <div className="col-md-6">
          <CampoFormulario
            id="registro-telefono"
            etiqueta="Teléfono"
            error={errores.telefono}
            ayuda="Opcional, para coordinar despachos."
            type="tel"
            maxLength={15}
            placeholder="+56912345678"
            value={datos.telefono}
            onChange={alCambiar('telefono')}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="registro-correo"
            required
            etiqueta="Correo *"
            error={errores.correo}
            type="email"
            maxLength={100}
            autoComplete="email"
            value={datos.correo}
            onChange={alCambiar('correo')}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="registro-clave"
            required
            etiqueta="Contraseña *"
            error={errores.clave}
            type="password"
            minLength={4}
            maxLength={10}
            autoComplete="new-password"
            value={datos.clave}
            onChange={alCambiar('clave')}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="registro-confirmacion"
            required
            etiqueta="Confirmar contraseña *"
            error={errores.confirmacion}
            type="password"
            minLength={4}
            maxLength={10}
            autoComplete="new-password"
            value={datos.confirmacion}
            onChange={alCambiar('confirmacion')}
          />
        </div>
      </div>
    </fieldset>
  );
}

export default DatosAccesoRegistro;