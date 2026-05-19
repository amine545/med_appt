import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  css: {
    postcss: {},
  },
  test: {
    globals: false,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
