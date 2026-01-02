// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

import sweetcorn from "@sweetcorn/astro";

// https://astro.build/config
export default defineConfig({
  site: "https://proffer.dev/",

  integrations: [sitemap(), sweetcorn()],

  // Image optimization configuration
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
  },

  // Security and performance optimizations
  security: {
    checkOrigin: true,
  },

  // Vite configuration
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Improve build performance
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro'],
          },
        },
      },
    },
  },

  experimental: {
    svgo: true
  }
});