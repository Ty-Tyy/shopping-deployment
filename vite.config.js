import { fileURLToPath, URL } from 'node:url'

import vueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from '@primevue/auto-import-resolver';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/shopping-deployment/',
  build: {
    chunkSizeWarningLimit: 1000, // Increase the size limit to 1 MB
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'vue'], // Specify libraries you want in separate chunks
        }
      }
    }
  },
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      resolvers: [
        PrimeVueResolver()
      ]
    })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
      host:'0.0.0.0',
      port: 5173,
      open: false,
      cors: true
    }
})
