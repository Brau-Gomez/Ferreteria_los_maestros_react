import { render, screen } from '@testing-library/react';
import MapaDespacho from '@/components/organisms/checkout/MapaDespacho.jsx';

// Se simula react-leaflet: Leaflet necesita medidas reales del navegador
// que jsdom no tiene. Cada pieza se reemplaza por un elemento simple que
// deja a la vista las props que importan para la prueba.
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="mapa">{children}</div>,
  TileLayer: () => <div data-testid="teselas" />,
  Circle: ({ center, pathOptions, children }) => (
    <div data-testid="zona" data-color={pathOptions.color} data-center={center.join(',')}>{children}</div>
  ),
  CircleMarker: ({ children }) => <div data-testid="tienda">{children}</div>,
  Popup: ({ children }) => <span>{children}</span>,
}));

describe('MapaDespacho', () => {
  it('dibuja la tienda y una zona por cada comuna con cobertura', () => {
    render(<MapaDespacho />);
    expect(screen.getByTestId('mapa')).toBeInTheDocument();
    expect(screen.getByTestId('tienda')).toHaveTextContent('Ferretería Los Maestros');
    expect(screen.getAllByTestId('zona')).toHaveLength(3);
    expect(screen.getByText('Despacho a Ovalle')).toBeInTheDocument();
  });

  it('sin comuna elegida todas las zonas usan el color base', () => {
    render(<MapaDespacho />);
    screen.getAllByTestId('zona').forEach((zona) => expect(zona).toHaveAttribute('data-color', '#0d6efd'));
  });

  it('resalta solo la comuna elegida', () => {
    render(<MapaDespacho comunaSeleccionada="Coquimbo" />);
    const verdes = screen.getAllByTestId('zona').filter((zona) => zona.getAttribute('data-color') === '#198754');
    expect(verdes).toHaveLength(1);
    expect(verdes[0]).toHaveTextContent('Despacho a Coquimbo');
  });

  it('muestra la leyenda del mapa', () => {
    render(<MapaDespacho />);
    expect(screen.getByText(/Punto rojo: nuestra tienda/)).toBeInTheDocument();
  });
});