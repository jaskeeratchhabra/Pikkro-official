import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/',
  plugins: [react()],

  server: {
    historyApiFallback: true,
    proxy: {
      host:'0.0.0.0',
      '/api': {
        target: 'https://api.pikkro.com',
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
