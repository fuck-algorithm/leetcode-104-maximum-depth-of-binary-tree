import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/leetcode-104-maximum-depth-of-binary-tree/',
  server: {
    port: 62588,
  },
})
