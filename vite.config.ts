import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { webcrypto } from "crypto";

// Fallback crypto (Capacitor / Android / Node)
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as unknown as Crypto;
}

// Détection GitHub Pages
const isGithubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  base: isGithubPages ? "/KingMenu/" : "/",
 
