// Bloque "Datos de la empresa" del registro (solo para contratistas).
// Presentacional: recibe datos y errores; avisa con onCambio(campo, valor).
import CampoFormulario from '../molecules/CampoFormulario.jsx';

function DatosEmpresaRegistro({ datos, errores, onCambio }) {
  function alCambiar(campo) {
    return (evento) => onCambio(campo, evento.target.value);
  }

  return (
    <fieldset className="registro-bloque mb-4">
      <legend>Datos de la empresa</legend>
      <div className="row">
        <div className="col-md-6">
          <CampoFormulario
            id="registro-empresaRut"
            required
            etiqueta="RUT de la empresa *"
            error={errores.empresaRut}
            ayuda="Sin puntos ni guion."
            minLength={7}
            maxLength={9}
            placeholder="761234567"
            value={datos.empresaRut}
            onChange={alCambiar('empresaRut')}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="registro-empresaRazon"
            required
            etiqueta="Razón social *"
            error={errores.empresaRazon}
            maxLength={100}
            value={datos.empresaRazon}
            onChange={alCambiar('empresaRazon')}
          />
        </div>
        <div className="col-12">
          <CampoFormulario
            id="registro-empresaDireccion"
            required
            etiqueta="Dirección de la empresa *"
            error={errores.empresaDireccion}
            as="textarea"
            maxLength={300}
            value={datos.empresaDireccion}
            onChange={alCambiar('empresaDireccion')}
          />
        </div>
      </div>
    </fieldset>
  );
}

export default DatosEmpresaRegistro;