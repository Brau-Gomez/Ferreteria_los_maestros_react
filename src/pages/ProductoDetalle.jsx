// Detalle de producto del catálogo. La página solo lee el código de la
// ruta (/productos/:codigo); la lógica vive en ProductoDetalleContainer.
// La key reinicia el estado del container al cambiar de producto.
import { useParams } from 'react-router-dom';
import ProductoDetalleContainer from '../containers/ProductoDetalleContainer.jsx';

function ProductoDetalle() {
  const { codigo } = useParams();
  return <ProductoDetalleContainer key={codigo} codigo={codigo} />;
}

export default ProductoDetalle;