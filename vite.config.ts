import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/prompting_for_performance/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  assetsInclude: ['**/*.svg', '**/*.csv'],
}))