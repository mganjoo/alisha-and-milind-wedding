import type { InvitationData } from "./fixtures.js"

const baseUrl = process.env.BASE_URL ?? "http://web-preview:9000"
const testToken = process.env.TEST_API_TOKEN ?? "local-e2e-only"

export async function testApi(path: string, init?: RequestInit) {
  const res = await fetch(new URL(`/api/test/${path}`, baseUrl), {
    ...init,
    headers: { "x-test-token": testToken, ...init?.headers },
  })
  if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`)
  return res
}

/**
 * Stored invitation (ignores visibility rules), including its derived
 * latestRsvp and the internal view timestamps.
 */
export async function storedInvitation(code: string): Promise<
  InvitationData & {
    latestRsvp?: { comments?: string; timestampMillis: number }
    firstViewedAt: number | null
    lastViewedAt: number | null
  }
> {
  return (await testApi(`invitations/${encodeURIComponent(code)}`)).json()
}

/** Queued notification emails with this subject. */
export async function queuedMail(
  subject: string
): Promise<{ recipient: string; subject: string; html: string }[]> {
  return (await testApi(`mail?${new URLSearchParams({ subject })}`)).json()
}
