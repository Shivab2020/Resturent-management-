import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure correct asset and router paths on GitHub Pages
  base: '/Resturent-management-/',
})
