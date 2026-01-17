import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { webcrypto } from "crypto";

// Fallback crypto (Capacitor / Android)
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as Crypto;
}

export default defineConfig(({ command }) => {
  const isBuild = command === "build";

  return {
    // ✅ IMPORTANT
    // - dev  → /
    // - build → /KingMenu/
    base: isBuild ? "/KingMenu/" : "/",

    plugins: [react()],

    resolve: {
      alias: {
        "@": "/src",
      },
    },

    optimizeDeps: {
      // ❌ NE PAS exclure lucide-react
      include: ["lucide-react"],
    },

    build: {
      sourcemap: false,
    },
  };
});
