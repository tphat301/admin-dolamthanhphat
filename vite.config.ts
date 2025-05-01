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
  css: {
    devSourcemap: true
  },
  // build: {
  //   outDir: 'dist', // nơi build ra file tĩnh
  //   minify: 'esbuild'
  // },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  }
  //  base: '/',              // ⚠️ QUAN TRỌNG khi deploy VPS (dùng Nginx)
})
