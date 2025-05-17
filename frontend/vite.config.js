import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite'
import { VarletImportResolver } from '@varlet/import-resolver'

export default defineConfig({
  plugins: [
    vue(),
    components({
      resolvers: [VarletImportResolver()]
    })
  ],
  build: {},
  resolve: {
    alias: {
      '@': '/src',
      '/': '/public'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
