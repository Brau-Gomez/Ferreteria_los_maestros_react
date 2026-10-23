import { render, screen, fireEvent } from '@testing-library/react';
import FiltrosCatalogo from './FiltrosCatalogo.jsx';

const base = {
  filtros: { texto: '', categoria: 'Todas', soloStock: false },
  categorias: ['Herramientas', 'Materiales'],
  onCambio: () => {},
};

describe('FiltrosCatalogo', () => {
  it('muestra los tres controles y las categorías recibidas', () => {
    render(<FiltrosCatalogo {...base} />);
    expect(screen.getByLabelText('Buscar por nombre, marca o código')).toBeInTheDocument();
    expect(screen.getByLabelText('Categoría')).toBeInTheDocument();
    expect(screen.getByLabelText('Sólo con stock')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Herramientas' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Materiales' })).toBeInTheDocument();
  });

  it('avisa el texto escrito en la búsqueda', () => {
    const onCambio = vi.fn();
    render(<FiltrosCatalogo {...base} onCambio={onCambio} />);
    fireEvent.change(screen.getByLabelText('Buscar por nombre, marca o código'), {
      target: { value: 'taladro' },
    });
    expect(onCambio).toHaveBeenCalledWith('texto', 'taladro');
  });

  it('avisa la categoría elegida', () => {
    const onCambio = vi.fn();
    render(<FiltrosCatalogo {...base} onCambio={onCambio} />);
    fireEvent.change(screen.getByLabelText('Categoría'), {
      target: { value: 'Herramientas' },
    });
    expect(onCambio).toHaveBeenCalledWith('categoria', 'Herramientas');
  });

  it('avisa cuando se marca "Sólo con stock"', () => {
    const onCambio = vi.fn();
    render(<FiltrosCatalogo {...base} onCambio={onCambio} />);
    fireEvent.click(screen.getByLabelText('Sólo con stock'));
    expect(onCambio).toHaveBeenCalledWith('soloStock', true);
  });
});