import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',  // GitHub Pages 需要仓库名作为路径
  plugins: [react(), tailwindcss()],
})
