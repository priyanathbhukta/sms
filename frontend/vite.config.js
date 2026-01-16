import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Enable source maps for debugging
    sourcemap: true,
    proxy: {
      // Proxy API requests to backend
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // Enable debugging
  build: {
    sourcemap: true,
  },
  // Define debug mode
  define: {
    __DEBUG__: JSON.stringify(true),
  }
})
