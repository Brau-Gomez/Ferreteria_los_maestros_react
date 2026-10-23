import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormularioRegistro from './FormularioRegistro.jsx';

const datosBase = {
  nombre: '', apellidos: '', run: '', fechaNacimiento: '', comuna: '', direccion: '',
  tipoCuenta: 'Cliente', empresaRut: '', empresaRazon: '', empresaDireccion: '',
  telefono: '', correo: '', clave: '', confirmacion: '',
};
const base = {
  datos: datosBase,
  errores: {},
  mensaje: '',
  exito: false,
  enviando: false,
  region: 'Región de Coquimbo',
  comunas: ['La Serena'],
  onCambio: () => {},
  onEnviar: (evento) => evento.preventDefault(),
};

function mostrar(propiedades) {
  return render(
    <MemoryRouter>
      <FormularioRegistro {...base} {...propiedades} />
    </MemoryRouter>,
  );
}

describe('FormularioRegistro', () => {
  it('no muestra los datos de empresa para un cliente particular', () => {
    mostrar();
    expect(screen.getByText('Datos personales')).toBeInTheDocument();
    expect(screen.getByText('Datos de acceso')).toBeInTheDocument();
    expect(screen.queryByText('Datos de la empresa')).not.toBeInTheDocument();
  });

  it('muestra los datos de empresa para un contratista', () => {
    mostrar({ datos: { ...datosBase, tipoCuenta: 'Contratista' } });
    expect(screen.getByText('Datos de la empresa')).toBeInTheDocument();
  });

  it('avisa el tipo de cuenta elegido', () => {
    const onCambio = vi.fn();
    mostrar({ onCambio });
    fireEvent.change(screen.getByLabelText('¿Cómo vas a comprar? *'), {
      target: { value: 'Contratista' },
    });
    expect(onCambio).toHaveBeenCalledWith('tipoCuenta', 'Contratista');
  });

  it('muestra el mensaje de éxito como estado y el enlace a ingresar', () => {
    mostrar({ mensaje: 'Cuenta creada.', exito: true });
    expect(screen.getByRole('status')).toHaveTextContent('Cuenta creada.');
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
  });
});