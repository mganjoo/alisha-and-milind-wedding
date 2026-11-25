/**
 * Thin client for the site's `/api` endpoints (Cloudflare Worker + D1).
 * Replaces direct Firestore access from the browser.
 */

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message)
  }
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(path, {
    ...init,
    headers: { accept: "application/json", ...init?.headers },
  })
  if (!res.ok && res.status !== 404) {
    const error = new ApiError(
      res.status,
      `${init?.method ?? "GET"} ${path}: ${res.status}`
    )
    console.error("Error during execution: ", error)
    throw error
  }
  return res
}

/** GET a JSON resource; `undefined` when it doesn't exist (404). */
export async function getJson(path: string): Promise<unknown | undefined> {
  const res = await request(path)
  return res.status === 404 ? undefined : res.json()
}

function post(path: string, body: unknown): Promise<Response> {
  return request(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

/** POST JSON; throws on any non-2xx status (including 404). */
export async function postJson(path: string, body: unknown): Promise<unknown> {
  const res = await post(path, body)
  if (res.status === 404) throw new ApiError(404, `POST ${path}: 404`)
  return res.json()
}

/**
 * POST JSON to look something up (the body keeps it out of the URL);
 * `undefined` when it doesn't exist (404), like `getJson`.
 */
export async function postLookup(
  path: string,
  body: unknown
): Promise<unknown | undefined> {
  const res = await post(path, body)
  return res.status === 404 ? undefined : res.json()
}
