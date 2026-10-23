import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VistaCuenta from './VistaCuenta.jsx';

const cliente = {
  run: '11111111-1', nombre: 'Ana', apellidos: 'Pérez', tipoUsuario: 'Cliente',
  direccion: 'Calle 123', comuna: 'La Serena', region: 'Región de Coquimbo',
};
const contratista = {
  ...cliente,
  esContratista: true,
  empresa: { razonSocial: 'Constructora Sur', rut: '761234567', direccion: 'Av. Norte 45' },
};

function mostrar(propiedades) {
  return render(
    <MemoryRouter>
      <VistaCuenta usuario={cliente} pedidos={[]} movimientos={[]} {...propiedades} />
    </MemoryRouter>,
  );
}

describe('VistaCuenta', () => {
  it('muestra para un cliente su perfil, dirección e historial de pedidos', () => {
    mostrar();
    expect(screen.getByText('Mi cuenta')).toBeInTheDocument();
    expect(screen.getByText('Dirección de despacho')).toBeInTheDocument();
    expect(screen.getByText('Historial de pedidos')).toBeInTheDocument();
    expect(screen.queryByText('Datos de la empresa')).not.toBeInTheDocument();
    expect(screen.queryByText('Cuenta corriente')).not.toBeInTheDocument();
  });

  it('muestra para un contratista los datos de empresa y la cuenta corriente', () => {
    mostrar({ usuario: contratista });
    expect(screen.getByText('Datos de la empresa')).toBeInTheDocument();
    expect(screen.getByText('Cuenta corriente')).toBeInTheDocument();
  });

  it('muestra para un administrador el acceso al panel y no el historial', () => {
    mostrar({ usuario: { ...cliente, tipoUsuario: 'Administrador' } });
    expect(screen.getByText('Acceso de administrador')).toBeInTheDocument();
    expect(screen.queryByText('Historial de pedidos')).not.toBeInTheDocument();
    expect(screen.queryByText('Dirección de despacho')).not.toBeInTheDocument();
  });
});