import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const base = command === 'build' ? '/DrawTogether-FrontEnd/' : '/';
  
  return {
    plugins: [react(), tailwindcss()],
    base,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    }
  }
})
