import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://getbaseline.run',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [db()],
  security: {
    allowedDomains: [
      {
        protocol: 'https',
        hostname: 'getbaseline.run',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4321',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4321',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
