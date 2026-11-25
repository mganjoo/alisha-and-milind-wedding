// Minimal typing for the Workers runtime module used by the API routes; the
// full @cloudflare/workers-types globals would clash with the DOM types the
// rest of the (browser) app is checked against.
declare module "cloudflare:workers" {
  export const env: unknown
}
