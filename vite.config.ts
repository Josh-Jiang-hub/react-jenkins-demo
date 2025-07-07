import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    watch: {
      usePolling: true, // 修复HMR热更新失效
    },
    hmr: {
      overlay: true,
    },
  },
});
