import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { webcrypto } from "crypto";

// Crypto fallback (Capacitor / Android)
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

// Detect GitHub Pages deploy
const isGithubPages = process.env.GITHUB_PAGES === "true";

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
