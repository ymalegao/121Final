// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// const phasermsg = () => {
//   return {
//     name: 'phasermsg',
//     buildStart() {
//       process.stdout.write(`Building for production...\n`);
//     },
//     buildEnd() {
//       const line = '---------------------------------------------------------';
//       const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️`;
//       process.stdout.write(`${line}\n${msg}\n${line}\n`);

//       process.stdout.write(`✨ Done ✨\n`);
//     },
//   };
// };

// export default defineConfig({
//   base: './',
//   plugins: [react(), phasermsg()],
//   logLevel: 'warning',
//   build: {
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           phaser: ['phaser'],
//         },
//       },
//     },
//     minify: 'terser',
//     terserOptions: {
//       compress: {
//         passes: 2,
//       },
//       mangle: true,
//       format: {
//         comments: false,
//       },
//     },
//   },
// });






import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

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
  base: './',
  plugins: [
    react(),
    phasermsg(),
    VitePWA({
      manifest: {
        name: 'Phaser React Game',
        short_name: 'PhaserGame',
        description: 'An exciting Phaser-based game with React integration.',
        start_url: '/index.html',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#87CEEB',
        icons: [
          {
            src: '/favicon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
        ],
      },
      registerType: 'autoUpdate',
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
