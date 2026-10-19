import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // pdf.js é importado dinamicamente pelo painel de slides (tecla S);
  // o include garante que ele já entre otimizado quando o dev server sobe.
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
  // Alias "@" -> ./src (exigido pelo shadcn init, ver HANDOFF §1)
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
