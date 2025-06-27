import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    svgr(),
  ],
  server: {
    port: 3000, // The port your frontend is running on (default for Vite)
    proxy: {
      // Rule 1: Proxy requests starting with '/api'
      '/api': {
        target: 'http://localhost:5347', // The URL of your backend server
        changeOrigin: true, // Necessary for virtual hosted sites
        secure: false, // Set to false if your backend is not using HTTPS (common for local dev)
        // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: remove the /api prefix if your backend routes don't have it
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
