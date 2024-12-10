import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const phasermsg = () => {
  return {
    name: 'phasermsg',
    buildStart() {
      process.stdout.write(`Building for production...\n`);
    },
    buildEnd() {
      const line =
        '---------------------------------------------------------';
      const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️`;
      process.stdout.write(`${line}\n${msg}\n${line}\n`);

      process.stdout.write(`✨ Done ✨\n`);
    },
  };
};

export default defineConfig({
  base: './', // Ensures paths are relative
  plugins: [
    react(),
    phasermsg(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/game/languagejson', // Source directory with JSON files
          dest: 'src/game', // Destination in the `dist` folder
        },
        {
          src: 'src/sw.js', // Service worker file
          dest: '.', // Root of the `dist` folder
        },
        {
          src: 'src/DSL', // Path to the DSL file
          dest: 'DSL', // Destination in the dist folder,
          include: ['*.dsl']
        },
      ],
    }),
  ],
  logLevel: 'warning',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2,
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
  },
});
