// Datos de contacto de la ferretería (horario, dirección, teléfono y correo).
// Organismo presentacional estático: no recibe props ni tiene estado.
function DatosTienda() {
  return (
    <aside className="contacto-datos h-100" aria-label="Datos de la ferretería">
      <h2>Visítanos o llámanos</h2>
      <section className="contacto-dato">
        <h3>Horario de atención</h3>
        <p>Lunes a viernes: 8:30 a 19:00</p>
        <p>Sábado: 9:00 a 14:00</p>
        <p>Domingo y festivos: cerrado</p>
      </section>
      <section className="contacto-dato">
        <h3>Dirección</h3>
        <p>Av. Francisco de Aguirre 1234</p>
        <p>La Serena, Región de Coquimbo</p>
      </section>
      <section className="contacto-dato">
        <h3>Teléfono</h3>
        <p>
          <a href="tel:+56512345678">+56 51 234 5678</a>
        </p>
      </section>
      <section className="contacto-dato mb-0">
        <h3>Correo</h3>
        <p>
          <a href="mailto:contacto@losmaestros.cl">contacto@losmaestros.cl</a>
        </p>
      </section>
    </aside>
  );
}

export default DatosTienda;