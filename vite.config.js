import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        sourcemap: false,
      },
    },
    build: {
      sourcemap: false,
      minify: 'esbuild',
    },
    esbuild: isProduction
      ? {
          drop: ['console', 'debugger'],
        }
      : undefined,
    server: {
      host: true,
      port: parseInt(env.FRONTEND_PORT),
      allowedHosts: [env.ALLOWED_HOST_TEST, env.ALLOWED_HOST_SERVER].filter(Boolean),
      // Proxies the Odoo API in dev so the browser calls same-origin Vite instead of hitting
      // the Odoo domain's CORS policy directly (see src/config/axios.js for the matching baseURL).
      proxy: env.VITE_API_URL ? {
        '/bt_hrms_mobile_access': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      } : undefined,
    },
    preview: {
      port: parseInt(env.FRONTEND_PORT),
      allowedHosts: [env.ALLOWED_HOST_TEST, env.ALLOWED_HOST_SERVER].filter(Boolean),
    },
  };
});
