import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Correction crypto (nécessaire pour Capacitor / Android)
import { webcrypto } from "crypto";
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

// 🔥 Détection automatique pour GitHub Pages
const isGithubPages = process.env.GITHUB_PAGES === "true";

// https://vitejs.dev/config/
export default defineConfig({
  base: isGithubPages ? "/KingMenu/" : "./",
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    rollupOptions: {
      external: ["../utils/pdfGenerator"],
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
