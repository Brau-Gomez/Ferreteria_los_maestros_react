import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminInicioContainer from './AdminInicioContainer.jsx';

describe('AdminInicioContainer', () => {
  it('calcula productos, usuarios y stock crítico desde el almacenamiento', () => {
    localStorage.clear();
    localStorage.setItem('ep1-products', JSON.stringify([
      { codigo: 'A', nombre: 'A', categoria: 'Madera', precioVenta: 1, stock: 1, stockMinimo: 2 },
      { codigo: 'B', nombre: 'B', categoria: 'Madera', precioVenta: 1, stock: 9, stockMinimo: 2 },
      { codigo: 'C', nombre: 'C', categoria: 'Madera', precioVenta: 1, stock: 9, stockMinimo: 2 },
    ]));
    localStorage.setItem('ep1-users', JSON.stringify([
      { run: '123456785', nombre: 'Ana', apellidos: 'P', correo: 'a@gmail.com', tipoUsuario: 'Cliente', activo: true },
      { run: '222222222', nombre: 'Luis', apellidos: 'S', correo: 'l@duoc.cl', tipoUsuario: 'Vendedor', activo: true },
    ]));
    render(
      <MemoryRouter>
        <AdminInicioContainer />
      </MemoryRouter>,
    );
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});