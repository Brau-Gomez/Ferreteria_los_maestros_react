// Cabecera compartida con accesos por sesión y contador reactivo del carrito.
//
// Porta el comportamiento de js/app.js del original:
// - El contador del carrito (antes #cart-count) es un Badge que se
//   actualiza con el CartContext, también entre pestañas.
// - "Mi cuenta" y "Cerrar sesión" aparecen solo con sesión activa;
//   sin sesión se muestra "Ingreso".
// - "Administración" solo para perfiles internos (Admin o Vendedor).
// - "Contacto" es un canal de clientes: los perfiles internos no lo ven.
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { obtenerCategorias } from '../../services/categorias.js';
import { useSesion } from '../../hooks/useSesion.js';
import { useCarrito } from '../../hooks/useCarrito.js';

function Header() {
  const { usuario, salir } = useSesion();
  const { contador } = useCarrito();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [categorias] = useState(() => obtenerCategorias());
  const perfilInterno = Boolean(usuario) && usuario.tipoUsuario !== 'Cliente';

  // La búsqueda lleva al catálogo con el texto ya aplicado (?q=...).
  function buscar(evento) {
    evento.preventDefault();
    const texto = busqueda.trim();
    navigate(texto ? '/productos?q=' + encodeURIComponent(texto) : '/productos');
  }

  // El original redirigía al ingreso tras cerrar sesión (cerrarSesion).
  function alCerrarSesion() {
    if (salir()) navigate('/ingreso');
  }

  return (
    <Navbar
      expand="lg"
      variant="dark"
      sticky="top"
      collapseOnSelect
      className="navbar-ferreteria"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2"
        >
          <img
            src="/assets/logo/logo-losMaestros.png"
            alt="Ferretería Los Maestros"
            width="42"
            height="42"
          />
          <span className="d-flex flex-column lh-sm">
            <strong>Los Maestros</strong>
            <small>Ferretería y construcción</small>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="nav-principal" />
        <Navbar.Collapse id="nav-principal">
          <Form className="d-flex my-2 my-lg-0 ms-lg-auto" role="search" onSubmit={buscar}>
            <Form.Control
              type="search"
              size="sm"
              placeholder="Buscar"
              aria-label="Buscar productos"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
            <Button type="submit" variant="warning" size="sm" className="ms-2">
              Buscar
            </Button>
          </Form>
          <Nav className="ms-lg-2 align-items-lg-center text-nowrap">
            {/* NavLink marca con .active la página actual. */}
            <Nav.Link as={NavLink} to="/" end>
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/productos">
              Catálogo
            </Nav.Link>
            <NavDropdown title="Categorías" id="menu-categorias">
              <NavDropdown.Item as={Link} to="/categorias">
                Todas las categorías
              </NavDropdown.Item>
              <NavDropdown.Divider />
              {categorias.map((categoria) => (
                <NavDropdown.Item
                  key={categoria}
                  as={Link}
                  to={'/categorias/' + encodeURIComponent(categoria)}
                >
                  {categoria}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <Nav.Link as={NavLink} to="/ofertas">
              Ofertas
            </Nav.Link>
            <Nav.Link as={NavLink} to="/carrito">
              Carrito{' '}
              <Badge pill bg="warning" text="dark">
                {contador}
              </Badge>
            </Nav.Link>
            {/* Los enlaces a secciones internas usan Link: son anclas
                dentro de la portada, no páginas con estado activo. */}
            <Nav.Link as={Link} to="/#nosotros">
              Nosotros
            </Nav.Link>
            <Nav.Link as={Link} to="/#blog">
              Blog
            </Nav.Link>
            {!perfilInterno && (
              <Nav.Link as={NavLink} to="/contacto">
                Contacto
              </Nav.Link>
            )}
            {usuario ? (
              <>
                <Nav.Link as={NavLink} to="/cuenta">
                  Mi cuenta
                </Nav.Link>
                {perfilInterno && (
                  // AdminLayout deriva a Vendedores al listado permitido de productos.
                  <Nav.Link as={NavLink} to="/admin">
                    Administración
                  </Nav.Link>
                )}
                <Button
                  variant="link"
                  className="nav-link p-0 border-0"
                  onClick={alCerrarSesion}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Nav.Link as={NavLink} to="/ingreso">
                Ingreso
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;