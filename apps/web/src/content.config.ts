import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

const events = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/events" }),
  schema: z.object({
    shortName: z.string(),
    title: z.string(),
    // Local wall-clock time at the venue (Las Vegas), kept as a plain string
    // so formatting never depends on the build machine's timezone.
    date: z.string(),
    endDate: z.string(),
    location: z.string(),
    preEvent: z.boolean().default(false),
    attire: z.string(),
    plainText: z.string(),
    subLocations: z
      .array(
        z.object({ name: z.string(), location: z.string(), date: z.string() })
      )
      .optional(),
  }),
})

export const collections = { events }
