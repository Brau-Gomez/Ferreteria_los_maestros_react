// Botones de acceso rápido con los perfiles de demostración.
// Presentacional: avisa el correo elegido con onSeleccionar(correo).
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

function AccesosDemo({ cuentas, onSeleccionar }) {
  return (
    <Stack direction="horizontal" gap={2} className="flex-wrap mb-4">
      {cuentas.map((cuenta) => (
        <Button
          key={cuenta.correo}
          type="button"
          variant="outline-primary"
          onClick={() => onSeleccionar(cuenta.correo)}
        >
          {cuenta.tipo}
        </Button>
      ))}
    </Stack>
  );
}

export default AccesosDemo;