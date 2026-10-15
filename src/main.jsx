// Punto de entrada de la aplicación.
// Orden de la cascada acordado: primero los estilos de Bootstrap y
// encima el tema propio, para que theme.css pueda sobrescribirlos.
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
