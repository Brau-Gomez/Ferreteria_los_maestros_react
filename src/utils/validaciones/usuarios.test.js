import { validarUsuario } from './usuarios.js';

const usuarioValido = {
  run: '123456785',
  nombre: 'Ana',
  apellidos: 'Pérez Soto',
  correo: 'ana@gmail.com',
  fechaNacimiento: '',
  tipoUsuario: 'Cliente',
  region: 'Región de Coquimbo',
  comuna: 'La Serena',
  direccion: 'Calle 123',
};

describe('validarUsuario', () => {
  it('un usuario correcto no tiene errores', () => {
    const errores = validarUsuario(usuarioValido, [], '');
    expect(Object.values(errores).every((mensaje) => mensaje === '')).toBe(true);
  });

  it('rechaza un RUN con dígito verificador incorrecto', () => {
    const errores = validarUsuario({ ...usuarioValido, run: '123456780' }, [], '');
    expect(errores.run).toMatch(/RUN válido/);
  });

  it('rechaza una región o comuna que no corresponde', () => {
    const errores = validarUsuario({ ...usuarioValido, region: 'Otra', comuna: 'Nada' }, [], '');
    expect(errores.region).toBe('Selecciona una región.');
    expect(errores.comuna).toMatch(/comuna de la región/);
  });

  it('rechaza un tipo de usuario inexistente', () => {
    const errores = validarUsuario({ ...usuarioValido, tipoUsuario: 'Invitado' }, [], '');
    expect(errores.tipoUsuario).toBe('Selecciona un tipo de usuario.');
  });

  it('rechaza una fecha de nacimiento futura', () => {
    const futura = `${new Date().getFullYear() + 1}-01-01`;
    const errores = validarUsuario({ ...usuarioValido, fechaNacimiento: futura }, [], '');
    expect(errores.fechaNacimiento).toMatch(/no futura/);
  });

  it('detecta RUN y correo repetidos', () => {
    const existentes = [{ run: '123456785', correo: 'ANA@gmail.com' }];
    const errores = validarUsuario(usuarioValido, existentes, '');
    expect(errores.run).toBe('Ya existe un usuario registrado con este RUN.');
    expect(errores.correo).toBe('Ya existe un usuario registrado con este correo.');
  });

  it('al editar, el propio usuario no cuenta como duplicado', () => {
    const existentes = [{ run: '123456785', correo: 'ana@gmail.com' }];
    const errores = validarUsuario(usuarioValido, existentes, '123456785');
    expect(errores.run).toBeUndefined();
    expect(errores.correo).toBe('');
  });
});