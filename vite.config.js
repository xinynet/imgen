import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'data',
  define: {
    __APP_VERSION__: JSON.stringify('0.3.5'),
    __DEV_PROXY_CONFIG__: JSON.stringify(null),
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
