import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3003
  },
  preview: {
    host: true,
    port: 3003,
    allowedHosts: ['admin.dolamthanhphat.io.vn', 'api.dolamthanhphat.io.vn']
  },
  css: {
    devSourcemap: false
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  }
})
