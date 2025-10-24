import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      external: ['../utils/pdfGenerator'], // Ensure the alias is configured or use a relative path
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Define the @ alias if used in external
    },
  },
});
