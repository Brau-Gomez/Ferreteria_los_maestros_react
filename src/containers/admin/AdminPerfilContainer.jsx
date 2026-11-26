// Container del perfil del panel: toma el usuario de la sesión.
// Solo renderiza PerfilAdmin.
import PerfilAdmin from '@/components/organisms/admin/PerfilAdmin.jsx';
import { useSesion } from '@/hooks/useSesion.js';

function AdminPerfilContainer() {
  const { usuario } = useSesion();
  // Mientras se restaura la sesión todavía no hay perfil que mostrar.
  if (!usuario) return null;
  return <PerfilAdmin usuario={usuario} />;
}

export default AdminPerfilContainer;