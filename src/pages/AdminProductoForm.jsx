// Formulario compartido para crear/editar productos del catálogo local.
import AdminProductoFormContainer from '../containers/AdminProductoFormContainer.jsx';

function AdminProductoForm({ modo }) {
  return <AdminProductoFormContainer modo={modo} />;
}

export default AdminProductoForm;