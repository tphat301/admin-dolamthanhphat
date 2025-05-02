import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
host: '0.0.0.0',
    allowedHosts: ['admin.dolamthanhphat.io.vn'],
    port: 3003, // đổi cổng khi preview
  },
  css: {
    devSourcemap: false
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild'
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  }
})
