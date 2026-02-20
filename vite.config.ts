// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: '/KingMenu/',

  plugins: [react()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    chunkSizeWarningLimit: 1200,

    // EXTERNALISER les modules Capacitor pour la build web
    rollupOptions: {
      external: [
        '@capacitor/core',
        '@capacitor/app',
        '@capacitor/android', // au cas où
      ],
    },
  },

  // Accélère le dev server (ignore Capacitor en dev)
  optimizeDeps: {
    exclude: [
      '@capacitor/core',
      '@capacitor/app',
      '@capacitor/android',
    ],
  },

  server: {
    port: 5173,
    open: true,
  },
});
