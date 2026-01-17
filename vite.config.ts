import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { webcrypto } from "crypto";

// Crypto fallback (Capacitor / Android)
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

export default defineConfig({
  base: "/KingMenu/",
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
