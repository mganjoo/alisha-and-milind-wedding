import type { ImageMetadata } from "astro"
import { getImage } from "astro:assets"

/**
 * Serialisable <picture> data for React islands (which can't use Astro's
 * <Picture> component). Built from getImage() with Astro's responsive
 * "constrained" layout, so widths and default `sizes` come from Astro.
 */
export interface PictureData {
  width: number
  height: number
  /** Fallback <img> src and srcset (JPEG). */
  src: string
  srcSet: string
  /** Modern-format <source>s, best first. */
  sources: { type: string; srcSet: string }[]
  sizes: string
}

const avif = { format: "avif", type: "image/avif" } as const
const webp = { format: "webp", type: "image/webp" } as const

/**
 * Modern formats to offer, best first. AVIF is skipped in dev: the dev server
 * encodes images on request, and AVIF encoding is slow enough to starve it
 * (delaying island hydration and flaking the e2e suite). Builds use both.
 */
export const pictureFormats: ("avif" | "webp")[] = import.meta.env.DEV
  ? ["webp"]
  : ["avif", "webp"]
const formats = import.meta.env.DEV ? [webp] : [avif, webp]

export async function pictureData(
  src: ImageMetadata,
  opts: { width: number; sizes?: string }
): Promise<PictureData> {
  const request = { src, width: Math.min(opts.width, src.width), sizes: opts.sizes, layout: "constrained" } as const
  const [fallback, ...modern] = await Promise.all([
    getImage({ ...request, format: "jpg" }),
    ...formats.map(({ format }) => getImage({ ...request, format })),
  ])
  return {
    width: fallback.options.width as number,
    height: fallback.options.height as number,
    src: fallback.src,
    srcSet: fallback.srcSet.attribute,
    sources: modern.map((image, i) => ({
      type: formats[i].type,
      srcSet: image.srcSet.attribute,
    })),
    sizes: fallback.attributes.sizes ?? opts.sizes ?? "100vw",
  }
}
