import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import { useSesion } from '../hooks/useSesion.js';
import { createWrapper } from '../test-utils.jsx';

vi.mock('../hooks/useSesion.js', () => ({
  useSesion: vi.fn(),
}));

function mostrar({ user, loading = false } = {}) {
  const mockValue = user ? { usuario: user, isAuthenticated: true, loading } : { usuario: null, isAuthenticated: false, loading };
  useSesion.mockReturnValue(mockValue);
  
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
    mostrar();
    expect(screen.getByText('Pantalla de ingreso')).toBeInTheDocument();
    expect(screen.queryByText('Contenido privado')).not.toBeInTheDocument();
  });

  it('redirige al ingreso mientras carga', () => {
    mostrar({ loading: true });
    expect(screen.getByText('Pantalla de ingreso')).toBeInTheDocument();
  });

  it('muestra el contenido si hay sesión activa', () => {
    mostrar({ user: { run: '1', tipoUsuario: 'Cliente' } });
    expect(screen.getByText('Contenido privado')).toBeInTheDocument();
  });
});