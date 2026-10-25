import { render, screen } from '@testing-library/react';
import App from './App.jsx';

// Prueba de humo de la raíz: App usa BrowserRouter, así que la ruta se fija
// en el historial del navegador simulado antes de montarla.
function montar(ruta) {
  localStorage.clear();
  window.history.pushState({}, '', ruta);
  return render(<App />);
}

describe('App', () => {
  beforeAll(() => {
    // jsdom no implementa matchMedia (lo usa el Offcanvas) ni scrollTo (lo usa ScrollManager).
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    }));
    window.scrollTo = vi.fn();
  });

  it('en la portada muestra cabecera, portada y pie', () => {
    montar('/');
    expect(screen.getByRole('link', { name: 'Ingreso' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Ferretería Los Maestros' })).toBeInTheDocument();
  });

  it('una ruta inexistente muestra la página 404', () => {
    montar('/ruta-que-no-existe');
    expect(screen.getAllByRole('heading', { level: 1 }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('heading', { level: 1, name: 'Ferretería Los Maestros' })).not.toBeInTheDocument();
  });

  it('en /admin sin sesión redirige al ingreso', () => {
    montar('/admin');
    expect(window.location.pathname).toBe('/ingreso');
  });
});