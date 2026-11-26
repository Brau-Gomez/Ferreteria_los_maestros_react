// Setup de Vitest compartido por todas las pruebas (slide 17 de la clase
// de la EP2): carga los matchers de jest-dom (toBeInTheDocument, toBeDisabled,
// toHaveTextContent...), que Vitest no trae incluidos.
import '@testing-library/jest-dom';
import { createElement } from 'react';
import { vi, beforeEach } from 'vitest';
import apiClient from '@/api/apiClient.js';
import { adaptadorFalso, limpiarServidorFalso } from '@/test/servidorFalso.js';

// Las peticiones HTTP no salen a la red: las responde un servidor falso que
// imita las rutas del backend (ver src/test/servidorFalso.js).
apiClient.defaults.adapter = adaptadorFalso;

beforeEach(() => {
  limpiarServidorFalso();
  localStorage.clear();
  sessionStorage.clear();
});

// Los componentes leen datos con TanStack Query y la sesión con AuthProvider,
// así que cada render de prueba se envuelve una sola vez aquí con esos
// proveedores, en vez de repetirlos en cada archivo de prueba.
vi.mock('@testing-library/react', async (importOriginal) => {
  const original = await importOriginal();
  const { QueryClient, QueryClientProvider } = await import('@tanstack/react-query');
  const { AuthProvider } = await import('@/context/AuthProvider.jsx');
  const { CartProvider } = await import('@/context/CartProvider.jsx');

  function render(ui, opciones = {}) {
    // Si la prueba dejó un usuario con sesión, AuthProvider la restaura.
    if (localStorage.getItem('ep1-user') && !sessionStorage.getItem('accessToken')) {
      sessionStorage.setItem('accessToken', 'token-falso');
    }
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
    });
    const Externo = opciones.wrapper;
    const Envoltura = ({ children }) => createElement(
      QueryClientProvider,
      { client },
      createElement(
        AuthProvider,
        null,
        createElement(
          CartProvider,
          null,
          Externo ? createElement(Externo, null, children) : children,
        ),
      ),
    );
    return original.render(ui, { ...opciones, wrapper: Envoltura });
  }

  return { ...original, render };
});
