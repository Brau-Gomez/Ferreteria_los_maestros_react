// Mapa de ubicación de la ferretería y zona de cobertura de despacho (RF-10).
// Presentacional: dibuja el mapa con Leaflet (react-leaflet) y resalta la
// comuna elegida, si hay una. Usa círculos en vez de íconos de marcador para
// no depender de imágenes externas.
import { Circle, CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { comunasCobertura, ubicacionTienda } from '../../data/cobertura.js';

function MapaDespacho({ comunaSeleccionada = '' }) {
  return (
    <figure className="mapa-despacho mb-0">
      <MapContainer
        center={ubicacionTienda.posicion}
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: '320px', width: '100%' }}
        aria-label="Mapa de ubicación y cobertura de despacho"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {comunasCobertura.map((zona) => (
          <Circle
            key={zona.comuna}
            center={zona.posicion}
            radius={zona.radio}
            pathOptions={{
              color: zona.comuna === comunaSeleccionada ? '#198754' : '#0d6efd',
              fillOpacity: zona.comuna === comunaSeleccionada ? 0.35 : 0.15,
            }}
          >
            <Popup>Despacho a {zona.comuna}</Popup>
          </Circle>
        ))}
        <CircleMarker center={ubicacionTienda.posicion} radius={9} pathOptions={{ color: '#dc3545', fillOpacity: 1 }}>
          <Popup>
            <strong>{ubicacionTienda.nombre}</strong>
            <br />
            {ubicacionTienda.direccion}
          </Popup>
        </CircleMarker>
      </MapContainer>
      <figcaption className="small text-muted mt-2">
        Punto rojo: nuestra tienda. Zonas azules: comunas con despacho
        (La Serena, Coquimbo y Ovalle).
      </figcaption>
    </figure>
  );
}

export default MapaDespacho;