// Container del listado de usuarios del admin: lee los perfiles guardados.
// Solo renderiza ListadoUsuariosAdmin.
import { useState } from 'react';
import ListadoUsuariosAdmin from '../components/organisms/ListadoUsuariosAdmin.jsx';
import { obtenerUsuarios } from '../services/almacenamiento.js';

function AdminUsuariosContainer() {
  const [usuarios] = useState(() => obtenerUsuarios());
  return <ListadoUsuariosAdmin usuarios={usuarios} />;
}

export default AdminUsuariosContainer;