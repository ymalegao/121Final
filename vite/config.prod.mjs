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
      const line = '---------------------------------------------------------';
      const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️`;
      process.stdout.write(`${line}\n${msg}\n${line}\n`);
      process.stdout.write(`✨ Done ✨\n`);
    },
  };
};

export default defineConfig({
  base: '/121Final/', // Ensures paths are relative
  plugins: [
    react(),
    phasermsg(),
    viteStaticCopy({
      targets: [
        {
          // Copies all files from src/game/languagejson to dist/game/languagejson
          src: 'src/game/languagejson',
          dest: 'game/'
        },
        {
          // Copies sw.js to dist/sw.js
          src: 'src/sw.js',
          dest: '.'
        },
        {
          // Copies all .dsl files from src/DSL to dist/DSL
          src: 'src/DSL',
          dest: 'DSL',
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
