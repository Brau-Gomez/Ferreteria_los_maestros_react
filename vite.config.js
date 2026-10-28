import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  plugins: [react()],
  // Pruebas unitarias con Vitest (stack obligatorio de la EP2, slide 16 de
  // la clase): jsdom simula el navegador y globals expone describe/it/expect
  // sin imports. El archivo de setup carga los matchers de jest-dom.
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    // Cobertura con V8: `npm run test:coverage` imprime la tabla en consola
    // y genera un reporte HTML navegable en la carpeta coverage/.
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/main.jsx', 'src/setupTests.js'],
    },
  },
})