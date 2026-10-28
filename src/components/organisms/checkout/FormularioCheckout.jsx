// Formulario de checkout: datos del cliente, entrega, dirección (solo con
// despacho) y pago. Presentacional: el estado y la validación viven en
// CheckoutContainer; aquí solo se dibujan los campos y se avisan los cambios.
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import MapaDespacho from '@/components/organisms/checkout/MapaDespacho.jsx';
import CampoFormulario from '@/components/molecules/CampoFormulario.jsx';

const opcionesEntrega = ['Retiro en tienda', 'Despacho'];

function FormularioCheckout({ datos, errores, comunas, onCambio, onEnviar }) {
  function alCambiar(campo) {
    return (evento) => onCambio(campo, evento.target.value);
  }

  return (
    <Form noValidate onSubmit={onEnviar}>
      <fieldset className="registro-bloque mb-4">
        <legend>Datos del cliente</legend>
        <div className="row">
          <div className="col-md-6">
            <CampoFormulario
              id="checkout-nombre"
              etiqueta="Nombre *"
              error={errores.nombre}
              maxLength={50}
              value={datos.nombre}
              onChange={alCambiar('nombre')}
            />
          </div>
          <div className="col-md-6">
            <CampoFormulario
              id="checkout-apellidos"
              etiqueta="Apellidos *"
              error={errores.apellidos}
              maxLength={100}
              value={datos.apellidos}
              onChange={alCambiar('apellidos')}
            />
          </div>
        </div>
        <CampoFormulario
          id="checkout-correo"
          type="email"
          etiqueta="Correo *"
          error={errores.correo}
          maxLength={100}
          value={datos.correo}
          onChange={alCambiar('correo')}
        />
      </fieldset>

      <fieldset className="registro-bloque mb-4">
        <legend>Entrega</legend>
        {opcionesEntrega.map((opcion) => (
          <Form.Check
            key={opcion}
            type="radio"
            id={'checkout-entrega-' + opcion}
            name="entrega"
            label={opcion}
            checked={datos.entrega === opcion}
            onChange={() => onCambio('entrega', opcion)}
          />
        ))}
        {datos.entrega === 'Despacho' && (
          <div className="mt-3">
            <CampoFormulario
              id="checkout-direccion"
              etiqueta="Dirección *"
              error={errores.direccion}
              maxLength={300}
              value={datos.direccion}
              onChange={alCambiar('direccion')}
            />
            <Form.Group className="mb-3" controlId="checkout-comuna">
              <Form.Label>Comuna *</Form.Label>
              <Form.Select
                isInvalid={Boolean(errores.comuna)}
                value={datos.comuna}
                onChange={alCambiar('comuna')}
              >
                <option value="">Selecciona una comuna</option>
                {comunas.map((comuna) => (
                  <option key={comuna} value={comuna}>{comuna}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
            </Form.Group>
            <p className="cuenta-descripcion">Región de Coquimbo</p>
            <MapaDespacho comunaSeleccionada={datos.comuna} />
          </div>
        )}
      </fieldset>

      <fieldset className="registro-bloque mb-4">
        <legend>Pago</legend>
        <CampoFormulario
          id="checkout-tarjeta"
          etiqueta="Número de tarjeta *"
          error={errores.tarjeta}
          ayuda="Simulación: una tarjeta terminada en 0000 es rechazada."
          inputMode="numeric"
          maxLength={19}
          placeholder="4111 1111 1111 1111"
          value={datos.tarjeta}
          onChange={alCambiar('tarjeta')}
        />
      </fieldset>

      <Button type="submit" variant="warning">Pagar ahora</Button>
    </Form>
  );
}

export default FormularioCheckout;