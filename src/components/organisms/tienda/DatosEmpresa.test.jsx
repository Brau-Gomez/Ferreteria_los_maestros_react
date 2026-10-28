import { render, screen } from '@testing-library/react';
import DatosEmpresa from '@/components/organisms/tienda/DatosEmpresa.jsx';

describe('DatosEmpresa', () => {
  it('muestra razón social, RUT y dirección de la empresa', () => {
    render(
      <DatosEmpresa
        empresa={{ razonSocial: 'Constructora Sur', rut: '761234567', direccion: 'Av. Norte 45' }}
      />,
    );
    expect(screen.getByText('Constructora Sur')).toBeInTheDocument();
    expect(screen.getByText('761234567')).toBeInTheDocument();
    expect(screen.getByText('Av. Norte 45')).toBeInTheDocument();
  });
});