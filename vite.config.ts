import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Only use the subdirectory base path when running in GitHub Actions
  base: process.env.GITHUB_ACTIONS ? '/TradeTrust-MVP/' : '/',
})
