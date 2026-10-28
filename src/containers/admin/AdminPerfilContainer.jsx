// Container del perfil del panel: toma el usuario de la sesión.
// Solo renderiza PerfilAdmin.
import PerfilAdmin from '@/components/organisms/admin/PerfilAdmin.jsx';
import { useSesion } from '@/hooks/useSesion.js';

function AdminPerfilContainer() {
  const { usuario } = useSesion();
  return <PerfilAdmin usuario={usuario} />;
}

export default AdminPerfilContainer;