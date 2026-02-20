// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // Base pour GitHub Pages (obligatoire)
  base: '/KingMenu/',

  plugins: [react()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // EXTERNALISER Capacitor (clé pour éviter l'erreur Rollup sur web)
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      external: [
        '@capacitor/core',
        '@capacitor/app',
        '@capacitor/android',
        // Ajoutez d'autres plugins Capacitor si vous en avez (ex: @capacitor/camera, etc.)
      ],
    },
  },

  // Accélère le dev et évite les erreurs de résolution Capacitor
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
