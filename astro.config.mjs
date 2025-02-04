// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://proffer.dev/",
  redirects: {
    '/about/': '/',
  },
  integrations: [sitemap()],
  experimental: {
    responsiveImages: true,
    svg: {
      mode: 'sprite',
    },
  },
  vite: { plugins: [tailwindcss()], },
});