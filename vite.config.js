import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.svg', 'icon-512.svg'],
      manifest: {
        name: 'CaféUni',
        short_name: 'CaféUni',
        description: 'Pedidos para la cafetería universitaria — consulta el menú, personaliza tu orden y acumula puntos.',
        theme_color: '#1B5E20',
        background_color: '#FAFAFA',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'es-MX',
        categories: ['food', 'lifestyle'],
        icons: [
          {
            src: '/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Ver Menú',
            short_name: 'Menú',
            url: '/menu/buenos-dias',
            icons: [{ src: '/icon-192.svg', sizes: '192x192' }]
          },
          {
            name: 'Mis Pedidos',
            short_name: 'Pedidos',
            url: '/pedidos',
            icons: [{ src: '/icon-192.svg', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: { '@': '/src' }
  }
})
