// @ts-check
import { defineConfig, svgoOptimizer } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import llms from "astro-llms-md";

// https://astro.build/config
export default defineConfig({
  site: "https://proffer.dev/",

  integrations: [sitemap(), llms({
    siteUrl: "https://proffer.dev",
    name: "Jacob Proffer",
    description: "Jacob Proffer is a front-end developer based in Marquette, Michigan with over ten years of experience in creating accessible and performant web solutions.",
    generateIndividualMd: true,
    generateLlmsTxt: true,
    generateLlmsFullTxt: true,
    titleSelector: "h1",
    contentSelector: "main",
    exclude: ["404", "404.html", "_astro"],
    verbose: false,
  })],

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
    svgOptimizer: svgoOptimizer()
  }
});