import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    historyApiFallback: true,
    proxy: {
      host:'0.0.0.0',
      '/api': {
        target: 'http://localhost:5000' || 'https://pikkro.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into its own chunk for better caching.
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})
