import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Pruebas unitarias con Vitest (stack obligatorio de la EP2, slide 16 de
  // la clase): jsdom simula el navegador y globals expone describe/it/expect
  // sin imports. El archivo de setup carga los matchers de jest-dom.
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
})
