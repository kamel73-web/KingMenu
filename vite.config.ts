// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // Chemin de base obligatoire pour GitHub Pages (repo KingMenu)
  base: '/KingMenu/',

  plugins: [react()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // Externaliser les modules Capacitor (important pour build web)
  // → ils ne doivent pas être bundlés sur web (seulement sur mobile)
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      external: [
        '@capacitor/core',
        '@capacitor/app',
        // Ajoutez ici d'autres plugins Capacitor si vous en utilisez (ex: @capacitor/camera)
      ],
    },
  },

  // Optimisations dev (facultatif mais utile)
  server: {
    port: 5173,
    open: true,
    hmr: true, // Hot Module Replacement activé
  },

  // Optimisations production (facultatif)
  optimizeDeps: {
    exclude: ['@capacitor/core', '@capacitor/app'],
  },
});
