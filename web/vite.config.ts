import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg', 'img/wiki/*.jpg'],
      manifest: {
        name: 'CCNA Learn',
        short_name: 'CCNA',
        description: 'Platformă de învățare CCNA 200-301',
        lang: 'ro',
        theme_color: '#0b1416',
        background_color: '#0b1416',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,woff2}'],
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [{ urlPattern: /^\/api\//, handler: 'NetworkOnly' }],
      },
    }),
  ],
  server: { host: true, proxy: { '/api': 'http://localhost:8080' } },
  build: { target: 'es2022', chunkSizeWarningLimit: 1500 },
});
