// Contenedor de la cabecera: concentra los hooks (sesión, carrito, router),
// el servicio de categorías y el estado del buscador. El organismo Header
// solo dibuja lo que recibe.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/organisms/Header.jsx';
import { obtenerCategorias } from '../services/categorias.js';
import { useSesion } from '../hooks/useSesion.js';
import { useCarrito } from '../hooks/useCarrito.js';

function HeaderContainer() {
  const { usuario, salir } = useSesion();
  const { contador } = useCarrito();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [categorias] = useState(() => obtenerCategorias());

  // La búsqueda lleva al catálogo con el texto ya aplicado (?q=...).
  function buscar(evento) {
    evento.preventDefault();
    const texto = busqueda.trim();
    navigate(texto ? '/productos?q=' + encodeURIComponent(texto) : '/productos');
  }

  // El original redirigía al ingreso tras cerrar sesión.
  function cerrarSesion() {
    if (salir()) navigate('/ingreso');
  }

  return (
    <Header
      usuario={usuario}
      contador={contador}
      categorias={categorias}
      busqueda={busqueda}
      onCambiarBusqueda={setBusqueda}
      onBuscar={buscar}
      onCerrarSesion={cerrarSesion}
    />
  );
}

export default HeaderContainer;