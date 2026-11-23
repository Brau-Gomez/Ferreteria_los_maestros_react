// Container del listado de usuarios del admin: lee los perfiles via API.
// Solo renderiza ListadoUsuariosAdmin.
import ListadoUsuariosAdmin from '@/components/organisms/admin/ListadoUsuariosAdmin.jsx';
import { useUsuarios } from '@/hooks/useUsuarios.js';

function AdminUsuariosContainer() {
  const { usuarios } = useUsuarios();
  return <ListadoUsuariosAdmin usuarios={usuarios} />;
}

export default AdminUsuariosContainer;