import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: "/KingMenu/",

  plugins: [react()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
      "https://vehqvqlbtotljstixklz.supabase.co"
    ),
    "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlaHF2cWxidG90bGpzdGl4a2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTAxOTEsImV4cCI6MjA2NjE2NjE5MX0.TnSx9bjz8wqo3pBPHaW11YtFcNYHg7Fckuo8z32rG4w"
    ),
  },
});
