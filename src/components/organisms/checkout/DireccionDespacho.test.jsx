import { render, screen } from '@testing-library/react';
import DireccionDespacho from '@/components/organisms/checkout/DireccionDespacho.jsx';

describe('DireccionDespacho', () => {
  it('muestra dirección, comuna y región del usuario', () => {
    render(
      <DireccionDespacho
        usuario={{ direccion: 'Calle 123', comuna: 'La Serena', region: 'Región de Coquimbo' }}
      />,
    );
    expect(screen.getByText('Calle 123')).toBeInTheDocument();
    expect(screen.getByText('La Serena')).toBeInTheDocument();
    expect(screen.getByText('Región de Coquimbo')).toBeInTheDocument();
  });

  it('avisa si todavía no hay dirección registrada', () => {
    render(<DireccionDespacho usuario={{}} />);
    expect(screen.getByText('Todavía no registras una dirección de despacho.')).toBeInTheDocument();
  });
});