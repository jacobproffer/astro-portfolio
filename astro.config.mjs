// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://proffer-portfolio.netlify.app/",
  integrations: [tailwind()],
  experimental: {
    responsiveImages: true,
  },
});