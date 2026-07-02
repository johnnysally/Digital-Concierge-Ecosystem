import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['@tanstack/react-query', '@tanstack/query-core'],
    alias: {
      '@tanstack/react-query': path.resolve(__dirname, 'node_modules/@tanstack/react-query'),
      '@tanstack/query-core': path.resolve(__dirname, 'node_modules/@tanstack/query-core'),
    },
  },
  optimizeDeps: {
    include: ['@tanstack/react-query', '@tanstack/query-core'],
  },
  server: {
    port: 3003,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
