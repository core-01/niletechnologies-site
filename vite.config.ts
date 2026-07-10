import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined
          if (/react-dom|react-router-dom|\/react\//.test(id)) return 'vendor-react'
          if (id.includes('recharts')) return 'vendor-charts'
          if (/react-hook-form|@hookform|zod/.test(id)) return 'vendor-forms'
          return 'vendor'
        },
      },
    },
  },
})
