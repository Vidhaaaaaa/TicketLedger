import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
})
=======
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
>>>>>>> 5ae93a98b319f4d4b5702e58bab2640ac42a3998
