import { devtools } from '@tanstack/devtools-vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },

  plugins: [
    tsConfigPaths(),
    devtools(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,

      generatedRouteTree: './src/route-tree.gen.ts',
    }),
    viteReact(),
  ],
});
