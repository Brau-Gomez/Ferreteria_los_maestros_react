import { desgloseIva, ordenarPedidos, buscarPedido, nombreCliente } from './boleta.js';

describe('desgloseIva', () => {
  it('separa neto e IVA del total con IVA incluido', () => {
    expect(desgloseIva(11900)).toEqual({ neto: 10000, iva: 1900, total: 11900 });
  });

  it('neto + IVA siempre suma el total', () => {
    const { neto, iva, total } = desgloseIva(11980);
    expect(neto + iva).toBe(total);
  });

  it('un total inválido da cero', () => {
    expect(desgloseIva(undefined)).toEqual({ neto: 0, iva: 0, total: 0 });
  });
});

describe('ordenarPedidos', () => {
  it('ordena del más nuevo al más antiguo sin modificar la lista original', () => {
    const lista = [{ id: 'PED-100' }, { id: 'PED-300' }, { id: 'PED-200' }];
    expect(ordenarPedidos(lista).map((p) => p.id)).toEqual(['PED-300', 'PED-200', 'PED-100']);
    expect(lista[0].id).toBe('PED-100');
  });
});

describe('buscarPedido', () => {
  it('encuentra por id o devuelve null', () => {
    const lista = [{ id: 'PED-1' }];
    expect(buscarPedido(lista, 'PED-1')).toEqual({ id: 'PED-1' });
    expect(buscarPedido(lista, 'PED-9')).toBeNull();
  });
});

describe('nombreCliente', () => {
  const usuarios = [{ run: '123456785', nombre: 'Ana', apellidos: 'Pérez' }];

  it('devuelve el nombre completo del perfil', () => {
    expect(nombreCliente(usuarios, '123456785')).toBe('Ana Pérez');
  });

  it('muestra el RUN si el perfil ya no existe', () => {
    expect(nombreCliente(usuarios, '999999999')).toBe('Cliente no registrado (999999999)');
  });
});