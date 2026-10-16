// Resumen administrativo: métricas del catálogo, usuarios y stock crítico.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useProductos } from '../hooks/useProductos.js';
import { obtenerUsuarios } from '../services/almacenamiento.js';

function AdminInicio() {
  const { productos } = useProductos();
  const [usuarios] = useState(() => obtenerUsuarios());
  const criticos = productos.filter((producto) => producto.stock <= producto.stockMinimo).length;

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="admin-kicker">Estado general</p>
          <h1>Panel de control</h1>
          <p>Administra el catálogo y los usuarios guardados.</p>
        </div>
      </header>
      <Row className="g-3 admin-metrics" aria-label="Resumen del sistema">
        <Col sm={6} xl={4}><Card className="admin-metric"><Card.Body><span>Catálogo base</span><strong>{productos.length}</strong><small>productos disponibles</small></Card.Body></Card></Col>
        <Col sm={6} xl={4}><Card className="admin-metric"><Card.Body><span>Perfiles definidos</span><strong>{usuarios.length}</strong><small>administrador, vendedor y cliente</small></Card.Body></Card></Col>
        <Col sm={6} xl={4}><Card className="admin-metric"><Card.Body><span>Stock crítico</span><strong>{criticos}</strong><small>alertas en el catálogo actual</small></Card.Body></Card></Col>
      </Row>
      <section className="admin-panel mt-4">
        <div className="admin-panel-header"><div><h2>Accesos rápidos</h2><p>Continúa desde la tarea que necesitas realizar.</p></div></div>
        <div className="admin-shortcuts">
          <Link className="admin-shortcut" to="/admin/productos"><strong>Revisar productos</strong><span>Consulta el inventario y abre el detalle de cada referencia.</span></Link>
          <Link className="admin-shortcut" to="/admin/productos/nuevo"><strong>Preparar un producto</strong><span>Crea una referencia y guárdala en el catálogo local.</span></Link>
          <Link className="admin-shortcut" to="/admin/usuarios"><strong>Revisar usuarios</strong><span>Consulta los perfiles registrados.</span></Link>
          <Link className="admin-shortcut" to="/admin/usuarios/nuevo"><strong>Preparar un usuario</strong><span>Crea un perfil validado para esta demostración.</span></Link>
        </div>
      </section>
    </>
  );
}

export default AdminInicio;
