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

const experience = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/experience" }),
  schema: z.object({
    company: z.string(),
    positions: z.array(
      z.object({
        position: z.string(),
        startDate: z.string(),
        endDate: z.string().optional(),
      })
    ),
    order: z.number(), // For sorting experience items
  }),
});

export const collections = { projects, experience };
