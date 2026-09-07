import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Platform note: supervisor runs `yarn start` and the K8s ingress expects the
// frontend on port 3000, with HMR over wss:443 through the preview URL.
export default defineConfig({
  plugins: [react()],
  // Expose both VITE_* (spec convention) and the platform's REACT_APP_BACKEND_URL
  envPrefix: ['VITE_', 'REACT_APP_'],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: true,
    hmr: { clientPort: 443 },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
  },
});
