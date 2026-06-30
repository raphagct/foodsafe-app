import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ['chrome >= 74'], // Force la compatibilité avec les navigateurs mobiles plus anciens
    }),
  ],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: {
        chrome: 74 << 16
      }
    }
  },
  build: {
    cssMinify: 'lightningcss'
  }
})