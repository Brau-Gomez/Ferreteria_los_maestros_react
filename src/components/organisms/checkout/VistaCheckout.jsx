// Vista completa del checkout. Según el estado muestra el formulario con el
// resumen, el pago correcto o el pago con error. Presentacional.
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FormularioCheckout from '@/components/organisms/checkout/FormularioCheckout.jsx';
import PagoConError from '@/components/organisms/checkout/PagoConError.jsx';
import PagoCorrecto from '@/components/organisms/checkout/PagoCorrecto.jsx';
import ResumenCompra from '@/components/organisms/checkout/ResumenCompra.jsx';

function VistaCheckout({
  estado,
  items,
  total,
  datos,
  errores,
  comunas,
  mensajeError,
  pedido,
  onCambio,
  onEnviar,
  onReintentar,
}) {
  if (estado === 'exito') return <PagoCorrecto pedido={pedido} />;
  if (estado === 'error') {
    return <PagoConError mensaje={mensajeError} onReintentar={onReintentar} />;
  }

  if (items.length === 0) {
    return (
      <div className="sin-resultados">
        <h2>Tu carrito está vacío</h2>
        <Link to="/productos">Ver catálogo</Link>
      </div>
    );
  }

  return (
    <>
      <p className="eyebrow mb-2">Último paso</p>
      <h1 className="titulo-seccion mb-4">Realizar pago</h1>
      <Row className="g-4">
        <Col lg={8}>
          <FormularioCheckout
            datos={datos}
            errores={errores}
            comunas={comunas}
            onCambio={onCambio}
            onEnviar={onEnviar}
          />
        </Col>
        <Col lg={4}>
          <ResumenCompra items={items} total={total} />
        </Col>
      </Row>
    </>
  );
}

export default VistaCheckout;