import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        'entry-client': './src/entry-client.tsx',
        'entry-server': './src/entry-server.tsx',
      },
    },
  },
  ssr: {
    noExternal: ['react-router-dom'],
  },
});
