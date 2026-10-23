import { render, screen, fireEvent } from '@testing-library/react';
import AccesosDemo from './AccesosDemo.jsx';

const cuentas = [
  { tipo: 'Administrador', correo: 'admin@duoc.cl' },
  { tipo: 'Vendedor', correo: 'vendedor@profesor.duoc.cl' },
];

describe('AccesosDemo', () => {
  it('muestra un botón por cada cuenta', () => {
    render(<AccesosDemo cuentas={cuentas} onSeleccionar={() => {}} />);
    expect(screen.getByRole('button', { name: 'Administrador' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vendedor' })).toBeInTheDocument();
  });

  it('avisa el correo de la cuenta elegida', () => {
    const onSeleccionar = vi.fn();
    render(<AccesosDemo cuentas={cuentas} onSeleccionar={onSeleccionar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Vendedor' }));
    expect(onSeleccionar).toHaveBeenCalledWith('vendedor@profesor.duoc.cl');
  });
});