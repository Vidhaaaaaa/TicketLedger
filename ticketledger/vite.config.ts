import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Inject environment variables as a global object
    'process.env': {
      REACT_APP_MODULE_ADDRESS: JSON.stringify(process.env.REACT_APP_MODULE_ADDRESS),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});