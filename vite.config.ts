import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Correction pour Codespaces / Node sans crypto global
import { webcrypto } from 'crypto';
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      // si tu utilises un module pdfGenerator externe, garde ceci
      external: ['../utils/pdfGenerator'],
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
