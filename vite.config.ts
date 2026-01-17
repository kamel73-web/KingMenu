import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { webcrypto } from "crypto";

// Crypto fallback (Capacitor / Android)
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as Crypto;
}

export default defineConfig({
  base: "/KingMenu/",

  plugins: [react()],

  // ⚠️ IMPORTANT : laisser Vite gérer lucide-react
  optimizeDeps: {
    include: ["lucide-react"],
  },

  build: {
    rollupOptions: {
      // Garde seulement si tu en as réellement besoin
      external: [],
    },
  },

  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
