import { expect, test } from "@playwright/test"
import { invitationByCode, invitees } from "../support/fixtures.js"
import { percySnapshot, waitForOpenedEnvelope } from "../support/helpers.js"

// Same fixture indexes the Cypress spec used from the seed response.
const email = invitees[0].id
const invitation = invitationByCode(invitees[0].data.code)
const invitation2 = invitationByCode(invitees[6].data.code)

test.describe("invitation tests", () => {
  test.describe("load code page", () => {
    test("should load an invitation correctly", async ({ page }) => {
      await page.goto(`/s/invitation/${invitation.code}`)
      await expect(
        page.getByText(new RegExp(invitation.partyName, "i"))
      ).toHaveCount(1)
      // Snapshot the opened envelope: the opening animation starts after a
      // delay, so capturing "whenever" (as Percy did) is timing-dependent.
      await waitForOpenedEnvelope(page)
      await percySnapshot(
        page,
        "invitation tests load code page should load an invitation correctly"
      )
    })

    test("should load a cached invitation when possible", async ({ page }) => {
      await page.goto(`/s/invitation/${invitation.code}`)
      await expect(
        page.getByText(new RegExp(invitation.partyName, "i"))
      ).toHaveCount(1)
      await page.goto(`/invitation`)
      await expect(
        page.getByText(new RegExp(invitation.partyName, "i"))
      ).toHaveCount(1)
      await page.goto(`/invitation?c=bla`)
      await expect(
        page.getByText(new RegExp(invitation.partyName, "i"))
      ).toHaveCount(1)
    })

    test("should load another invitation when a new code is provided", async ({
      page,
    }) => {
      await page.goto(`/s/invitation/${invitation.code}`)
      await expect(
        page.getByText(new RegExp(invitation.partyName, "i"))
      ).toHaveCount(1)
      await page.goto(`/s/invitation/${invitation2.code}`)
      await expect(
        page.getByText(new RegExp(invitation2.partyName, "i"))
      ).toHaveCount(1)
    })

    test("should redirect to home page correctly", async ({ page }) => {
      await page.goto(`/s/home/${invitation.code}`)
      await expect(page.getByText(/see you soon in vegas/i)).toHaveCount(1)
      await page.goto(`/schedule`)
      await expect(
        page.getByText(/you can find more information/i).first()
      ).toBeAttached()
    })

    test("should show login page when a code is not found", async ({
      page,
    }) => {
      await page.goto(`/s/invitation/bla`)
      await expect(page.getByLabel(/email address/i)).toHaveCount(1)
    })
  })

  test.describe("login page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/invitation`)
      // Wait for the form to render (Cypress findBy* retried until found).
      await expect(page.getByLabel(/email address/i)).toHaveCount(1)
      await expect(page.getByText(/submit/i)).toHaveCount(1)
    })

    test("should load an invitation correctly", async ({ page }) => {
      await page.getByLabel(/email address/i).fill(email)
      await page.getByText(/submit/i).click()
      await expect(
        page.getByText(new RegExp(invitation.partyName, "i"))
      ).toHaveCount(1)
    })

    test("should load an invitation correctly when email is different case", async ({
      page,
    }) => {
      await page.getByLabel(/email address/i).fill(email.toUpperCase())
      await page.getByText(/submit/i).click()
      await expect(
        page.getByText(new RegExp(invitation.partyName, "i"))
      ).toHaveCount(1)
    })

    test("should validate empty input", async ({ page }) => {
      await page.getByText(/submit/i).click()
      await expect(page.getByText(/please enter a valid email/i)).toHaveCount(1)
      await percySnapshot(
        page,
        "invitation tests login page should validate empty input"
      )
    })

    test("should show error on invalid email", async ({ page }) => {
      await page.getByLabel(/email address/i).fill("bla@example.com")
      await page.getByText(/submit/i).click()
      await expect(page.getByText(/couldn’t find an invitation/i)).toHaveCount(
        1
      )
      await percySnapshot(
        page,
        "invitation tests login page should show error on invalid email"
      )
    })

    test("should redirect to email entry page on error", async ({ page }) => {
      // Special trigger email: the lookup always fails
      await page
        .getByLabel(/email address/i)
        .fill("__reject_request__@example.com")
      await page.getByText(/submit/i).click()
      await expect(page.getByText(/error retrieving/i)).toHaveCount(1)
    })

    test("should show an error for inactive email", async ({ page }) => {
      // Known inactive email
      await page.getByLabel(/email address/i).fill("test_inactive@example.com")
      await page.getByText(/submit/i).click()
      await expect(page.getByText(/error retrieving/i)).toHaveCount(1)
    })
  })
})
