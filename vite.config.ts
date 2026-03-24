import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      external: ['@tauri-apps/api', '@tauri-apps/api/core', '@tauri-apps/api/http', '@tauri-apps/api/event'],
    },
  },
})
