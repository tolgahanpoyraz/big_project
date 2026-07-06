import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // In dev we proxy /api to the local API server so the browser stays same-origin
  // (no CORS setup needed). Override the target with API_PROXY_TARGET if the API
  // runs elsewhere. In production VITE_API_BASE_URL points the client at the API.
  const target = env.API_PROXY_TARGET || 'http://localhost:5001'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': { target, changeOrigin: true },
      },
    },
  }
})
