import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // This polyfills 'process.env' for the browser
    'process.env': {},
  },
})