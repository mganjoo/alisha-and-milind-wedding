import { randomUUID } from "node:crypto"
import { expect, test } from "@playwright/test"
import { queuedMail, storedInvitation } from "../support/backend.js"
import { invitationByCode, inviteeForCode } from "../support/fixtures.js"

/**
 * End to end through the RSVP API (Worker + local D1): an RSVP submitted in
 * the browser must become the invitation's latest RSVP and queue a
 * notification email in `mail`, and looking the invitation up must record a
 * view. The backend is inspected through the site's test-only endpoints.
 * Uses its own invitation so no other spec is affected.
 */

test("RSVP becomes the derived latestRsvp and queues an email; lookups are views", async ({
  page,
}) => {
  const code = "testrsvpapi"
  const invitation = invitationByCode(code)
  // Unique per run, so we find this run's email among earlier ones.
  const token = `run-${randomUUID()}`
  // Allow for clock differences between the test and Worker containers.
  const startedAt = Date.now() - 5_000

  await page.goto("/rsvp")
  await page.getByLabel(/email address/i).fill(inviteeForCode(code).id)
  await page.getByText(/submit/i).click()
  await page.getByLabel(/no, will celebrate/i).check()
  await page.getByLabel(/comments/i).fill(token)
  await page.getByText(/submit rsvp/i).click()
  await expect(page.getByText(/not attending/i)).toBeVisible()

  // The lookup by email was recorded as a view (in waitUntil).
  await expect
    .poll(async () => (await storedInvitation(code)).lastViewedAt ?? 0, {
      timeout: 30_000,
    })
    .toBeGreaterThanOrEqual(startedAt)
  const { firstViewedAt, lastViewedAt } = await storedInvitation(code)
  expect(firstViewedAt).toBeLessThanOrEqual(lastViewedAt ?? 0)

  // The invitation's latestRsvp (derived from the newest rsvps row) is this
  // RSVP.
  await expect
    .poll(async () => (await storedInvitation(code)).latestRsvp?.comments, {
      timeout: 30_000,
    })
    .toBe(token)
  const { latestRsvp } = await storedInvitation(code)
  expect(latestRsvp?.timestampMillis).toBeGreaterThanOrEqual(startedAt)

  // Notification email queued (nothing sends it).
  await expect
    .poll(
      async () =>
        (await queuedMail(`New RSVP received: ${invitation.partyName}`)).some(
          (mail) => mail.html.includes(token)
        ),
      { timeout: 30_000 }
    )
    .toBe(true)
})

// Regression: codes may contain characters that encodeURIComponent escapes
// (2022's codes include `:`). The client encodes the code in the API path; the
// routes must decode it, or the RSVP fails with "problem submitting".
test("RSVP works for an invitation whose code contains reserved URL characters", async ({
  page,
}) => {
  const code = "t:M3AxoQSl"
  const token = `run-${randomUUID()}`

  await page.goto("/rsvp")
  await page.getByLabel(/email address/i).fill(inviteeForCode(code).id)
  await page.getByText(/submit/i).click()
  await page.getByLabel(/no, will celebrate/i).check()
  await page.getByLabel(/comments/i).fill(token)
  await page.getByText(/submit rsvp/i).click()
  await expect(page.getByText(/not attending/i)).toBeVisible()

  await expect
    .poll(async () => (await storedInvitation(code))?.latestRsvp?.comments)
    .toBe(token)
})
