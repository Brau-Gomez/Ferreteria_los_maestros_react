import Card from 'react-bootstrap/Card';

function TarjetaPerfil({ usuario }) {
  const nombre = `${usuario.nombre || ''} ${usuario.apellidos || ''}`.trim();
  const campos = [
    ['RUN', usuario.run],
    ['Correo', usuario.correo],
    ['Teléfono', usuario.telefono],
    ['Fecha de nacimiento', usuario.fechaNacimiento],
    ['Región', usuario.region],
    ['Comuna', usuario.comuna],
  ].filter(([, valor]) => valor);

  return (
    <Card className="tarjeta-cuenta h-100">
      <Card.Body>
        <div className="perfil-encabezado">
          <span className="perfil-avatar" aria-hidden="true">
            {nombre.charAt(0).toUpperCase()}
          </span>
          <div>
            <h2 className="h5 mb-1">{nombre}</h2>
            <span className="perfil-rol">{usuario.tipoUsuario}</span>
          </div>
        </div>
        <dl className="perfil-datos mb-0">
          {campos.map(([etiqueta, valor]) => (
            <div className="perfil-fila" key={etiqueta}>
              <dt>{etiqueta}</dt>
              <dd>{valor}</dd>
            </div>
          ))}
        </dl>
      </Card.Body>
    </Card>
  );
}

export default TarjetaPerfil;
