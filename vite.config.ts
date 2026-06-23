import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true';

export default defineConfig({
  plugins: [react()],
  base: isCapacitorBuild ? '/' : '/KingMenu/',
  resolve: {
    alias: {
      ...(isCapacitorBuild
        ? {}
        : {
            '@capacitor/core': path.resolve(__dirname, 'src/stubs/capacitor-core.ts'),
            '@capacitor/app': path.resolve(__dirname, 'src/stubs/capacitor-app.ts'),
          }),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});