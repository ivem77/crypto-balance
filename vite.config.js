import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/blockchair': {
        target: 'https://api.blockchair.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/blockchair/, '')
      },
      '/api/coingecko': {
        target: 'https://api.coingecko.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coingecko/, '')
      },
      '/api/solana': {
        target: 'https://solana-mainnet.g.alchemy.com/v2/demo',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/solana/, ''),
        headers: {
          'Content-Type': 'application/json'
        }
      },
      '/api/ethereum': {
        target: 'https://ethereum-rpc.publicnode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ethereum/, ''),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    }
  }
})
