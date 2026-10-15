// Mi cuenta (stub temporal).
// El perfil, el historial de pedidos y la cuenta corriente del contratista
// se implementan en la Fase 7 del plan. La ruta está protegida: sin sesión
// activa redirige al ingreso (ProtectedRoute en App.jsx).
import Container from 'react-bootstrap/Container';

function Cuenta() {
  return (
    <Container className="py-5">
      <h1 className="mb-3">Mi cuenta</h1>
      <p className="text-muted mb-0">
        Cuenta en migración: el perfil, los pedidos y la cuenta corriente del
        contratista se implementan en la Fase 7 del plan.
      </p>
    </Container>
  );
}

export default Cuenta;
