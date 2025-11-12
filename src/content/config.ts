import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      url: z.string().url(),
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      thumbnail: image(),
    }),
});

export const collections = { projects };
