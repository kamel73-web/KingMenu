// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // Chemin de base pour GitHub Pages (repo KingMenu)
  base: '/KingMenu/',

  plugins: [react()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // PAS DE DEFINE pour Supabase ici !
  // → Utilisez .env.local ou .env pour VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
  // Vite les expose automatiquement via import.meta.env.VITE_...

  // Optionnel : augmente la limite de warning chunks (votre build a des gros chunks)
  build: {
    chunkSizeWarningLimit: 1200, // ou 1500 si vous gardez html2canvas/jspdf
  },

  // Optionnel : server pour dev local (utile si vous testez avec proxy)
  server: {
    port: 5173,
    open: true,
  },
});
