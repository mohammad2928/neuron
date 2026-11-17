import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Default: production API (no local PHP needed).
  // For local PHP+MySQL: set API_PROXY_TARGET=http://127.0.0.1:8080 in .env.development.local
  const apiTarget = env.API_PROXY_TARGET || 'https://neuron.monyar.ir'

  return {
    plugins: [react()],
    server: {
      fs: {
        deny: [
          '**/data/private/**',
          '**/src/data/papers/papers.json',
          '**/src/data/venues/venues.json',
        ],
      },
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
