import { render, screen } from '@testing-library/react';
import InsigniaEstado from './InsigniaEstado.jsx';

describe('InsigniaEstado', () => {
  it('muestra el texto con el color indicado', () => {
    render(<InsigniaEstado variante="success">Activo</InsigniaEstado>);
    expect(screen.getByText('Activo')).toHaveClass('bg-success');
  });
  it('usa gris por defecto', () => {
    render(<InsigniaEstado>Inactivo</InsigniaEstado>);
    expect(screen.getByText('Inactivo')).toHaveClass('bg-secondary');
  });
});