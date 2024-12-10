import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/game/languagejson/*.json', // Match all JSON files in this folder
          dest: 'src/game/languagejson', // Destination inside `dist`
        },
        {
          src: 'src/sw.js', // Copy the service worker
          dest: '.', // Copy to the root of `dist`
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
});
