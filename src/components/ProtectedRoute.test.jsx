import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import { useSesion } from '../hooks/useSesion.js';

// Mock de useSesion: se controla si hay o no un usuario con sesión activa.
vi.mock('../hooks/useSesion.js', () => ({
  useSesion: vi.fn(),
}));

function mostrar() {
  return render(
    <MemoryRouter initialEntries={['/cuenta']}>
      <Routes>
        <Route path="/ingreso" element={<p>Pantalla de ingreso</p>} />
        <Route
          path="/cuenta"
          element={
            <ProtectedRoute>
              <p>Contenido privado</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('redirige al ingreso si no hay sesión', () => {
    useSesion.mockReturnValue({ usuario: null });
    mostrar();
    expect(screen.getByText('Pantalla de ingreso')).toBeInTheDocument();
    expect(screen.queryByText('Contenido privado')).not.toBeInTheDocument();
  });

  it('muestra el contenido si hay sesión activa', () => {
    useSesion.mockReturnValue({ usuario: { run: '1', tipoUsuario: 'Cliente' } });
    mostrar();
    expect(screen.getByText('Contenido privado')).toBeInTheDocument();
  });
});