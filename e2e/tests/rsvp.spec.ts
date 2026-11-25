import { expect, type Page, test } from "@playwright/test"
import { invitationByCode, inviteeForCode } from "../support/fixtures.js"
import { expectNoA11yViolations, percySnapshot } from "../support/helpers.js"

async function openInvitation(page: Page, code: string) {
  const invitation = invitationByCode(code)
  const invitee = inviteeForCode(code)
  await page.getByLabel(/email address/i).fill(invitee.id)
  await page.getByText(/submit/i).click()
  return { invitation, invitee }
}

test.describe("RSVP page", () => {
  // Run in file order, as the Cypress suite did: once an RSVP is submitted,
  // the invitation's latest RSVP is then the one just submitted, so later
  // tests reusing it would see the "already responded" view. The order
  // guarantees no invitation is reused after its RSVP is submitted.
  test.describe.configure({ mode: "default" })

  test.beforeEach(async ({ page }) => {
    await page.goto("/rsvp")
    // Wait for the form to render (Cypress findBy* retried until found).
    await expect(page.getByLabel(/email address/i)).toHaveCount(1)
    await expect(page.getByText(/submit/i)).toHaveCount(1)
  })

  test("should prevent submission when fields are unfilled", async ({
    page,
  }) => {
    // 2 person invitation
    await openInvitation(page, "test2")

    await page.getByLabel(/name of 1st guest/i).fill("")
    await page.getByLabel(/name of 2nd guest/i).fill("")

    await page.getByText(/next: specific events/i).click()
    await expect(page.getByText(/at least one name is required/i)).toHaveCount(
      1
    )
    await expect(page.getByText(/please confirm your attendance/i)).toHaveCount(
      1
    )
    await expect(
      page.getByText(/please acknowledge the covid policy/i)
    ).toHaveCount(0)
    await percySnapshot(
      page,
      "RSVP page should prevent submission when fields are unfilled"
    )
    // Make sure error state is accessible
    await expectNoA11yViolations(page)

    // filling out fields restores errors
    await page.getByLabel(/name of 1st guest/i).fill("Jack Jones")
    await expect(page.getByText(/at least one name is required/i)).toHaveCount(
      0
    )
    await page.getByLabel(/yes/i).check()
    await expect(
      page.getByText(/please acknowledge the covid policy/i)
    ).toHaveCount(1)
    await page.getByLabel(/covid test within 48 hours/i).check()
    await expect(page.getByText(/please confirm your attendance/i)).toHaveCount(
      0
    )
  })

  test("should prevent moving forward if covid policy is not accepted", async ({
    page,
  }) => {
    await openInvitation(page, "test2")
    await page.getByLabel(/yes/i).check()
    await page.getByText(/next: specific events/i).click()
    await expect(
      page.getByText(/please acknowledge the covid policy/i)
    ).toHaveCount(1)
    await percySnapshot(
      page,
      "RSVP page should prevent moving forward if covid policy is not accepted"
    )
    await page.getByLabel(/covid test within 48 hours/i).check()
    await expect(page.getByText(/please confirm your attendance/i)).toHaveCount(
      0
    )
  })

  test("should prevent submission if no event attendance is selected", async ({
    page,
  }) => {
    // 2 person invitation, with puja
    const { invitation } = await openInvitation(page, "test2")

    await page.getByLabel(/yes/i).check()
    await page.getByLabel(/covid test within 48 hours/i).check()
    await page.getByText(/next: specific events/i).click()

    await page.getByText(/submit rsvp/i).click()

    await expect(page.getByText(/make a selection/i)).toHaveCount(1)
    await percySnapshot(
      page,
      "RSVP page should prevent submission if no event attendance is selected"
    )
    // Make sure error state is accessible
    await expectNoA11yViolations(page)

    // checking at least one field restores errors
    const reception = page.getByLabel(/reception/i)
    await reception
      .getByLabel(invitation.knownGuests[0], { exact: true })
      .check()
    await expect(page.getByText(/make a selection/i)).toHaveCount(0)
  })

  test("should preserve attendance choices when only name spellings are changed", async ({
    page,
  }) => {
    // 3 person invitation
    const { invitation } = await openInvitation(page, "test3")

    await page.getByLabel(/yes/i).check()
    await page.getByLabel(/covid test within 48 hours/i).check()
    await page.getByText(/next: specific events/i).click()

    const reception = page.getByLabel(/reception/i)
    await reception
      .getByLabel(invitation.knownGuests[0], { exact: true })
      .check()
    await reception
      .getByLabel(invitation.knownGuests[2], { exact: true })
      .check()

    // go back and forth
    await page.getByText(/back: guest details/i).click()
    await page.getByLabel(/name of 1st guest/i).fill("Jack Jones")
    await page.getByText(/next: specific events/i).click()

    await expect(
      reception.getByLabel("Jack Jones", { exact: true })
    ).toBeChecked()
    await expect(
      reception.getByLabel(invitation.knownGuests[2], { exact: true })
    ).toBeChecked()
  })

  test("should reset attendance choices when guest is removed", async ({
    page,
  }) => {
    // 2 person invitation
    const { invitation } = await openInvitation(page, "test3")

    await page.getByLabel(/yes/i).check()
    await page.getByLabel(/covid test within 48 hours/i).check()
    await page.getByText(/next: specific events/i).click()

    const reception = page.getByLabel(/reception/i)
    await reception.getByLabel(/all guests are attending/i).check()

    // go back and change a name, and go forward
    await page.getByText(/back: guest details/i).click()
    await page.getByLabel(/name of 2nd guest/i).fill("")
    await page.getByText(/next: specific events/i).click()
    await expect(
      reception.getByLabel(invitation.knownGuests[0], { exact: true })
    ).toBeChecked()
    await expect(
      reception.getByLabel(invitation.knownGuests[1], { exact: true })
    ).toHaveCount(0)
    await expect(
      reception.getByLabel(invitation.knownGuests[2], { exact: true })
    ).toBeChecked()

    // go back again, and add a new name
    await page.getByText(/back: guest details/i).click()
    await page.getByLabel(/name of 2nd guest/i).fill("Jack Jones")
    await page.getByText(/next: specific events/i).click()
    await expect(
      reception.getByLabel(invitation.knownGuests[0], { exact: true })
    ).toBeChecked()
    await expect(
      reception.getByLabel("Jack Jones", { exact: true })
    ).not.toBeChecked()
    await expect(
      reception.getByLabel(invitation.knownGuests[2], { exact: true })
    ).toBeChecked()
  })

  test("should adapt UI to 1-person case", async ({ page }) => {
    const { invitation } = await openInvitation(page, "test1")

    await expect(page.getByLabel("Name", { exact: true })).toHaveValue(
      invitation.knownGuests[0]
    )
    await page.getByLabel(/yes/i).check()
    await page.getByLabel(/covid test within 48 hours/i).check()
    await page.getByText(/next: specific events/i).click()

    const reception = page.getByLabel(/reception/i)
    await expect(reception.getByLabel(/attending/i)).toHaveCount(1)
    await percySnapshot(page, "RSVP page should adapt UI to 1-person case")
    await expectNoA11yViolations(page)

    // should prevent submission if no event is selected
    await page.getByText(/submit rsvp/i).click()
    await expect(page.getByText(/make a selection/i)).toHaveCount(1)
    await reception.getByLabel(/attending/i).check()
    await expect(page.getByText(/make a selection/i)).toHaveCount(0)
  })

  test("should adapt UI to 3 or more people", async ({ page }) => {
    // 3 person invitation
    await openInvitation(page, "test3")

    await page.getByLabel(/yes/i).check()
    await page.getByLabel(/covid test within 48 hours/i).check()
    await page.getByText(/next: specific events/i).click()

    await expect(
      page.getByText(/all guests are attending/i).first()
    ).toBeAttached()
  })

  test("should adapt UI to case where not all names are filled", async ({
    page,
  }) => {
    // 3 person invitation, only two filled
    await openInvitation(page, "test32")

    await page.getByLabel(/yes/i).check()
    await page.getByLabel(/covid test within 48 hours/i).check()
    await page.getByText(/next: specific events/i).click()

    await expect(
      page.getByText(/both guests are attending/i).first()
    ).toBeAttached()
  })

  // This test is more of a unit test for checkbox group functionality
  test("should allow selection and deselection of arbitrary checkboxes", async ({
    page,
  }) => {
    const { invitation } = await openInvitation(page, "test2")

    await page.getByLabel(/yes/i).check()
    await page.getByLabel(/covid test within 48 hours/i).check()
    await page.getByText(/next: specific events/i).click()

    const reception = page.getByLabel(/reception/i)
    await reception.getByLabel(/both guests are attending/i).check()
    await reception.getByLabel(/both guests are attending/i).uncheck()
    await reception
      .getByLabel(invitation.knownGuests[0], { exact: true })
      .check()
    await reception
      .getByLabel(invitation.knownGuests[0], { exact: true })
      .uncheck()
  })

  test("should submit a no response correctly", async ({ page }) => {
    // 3 person invitation
    const { invitation } = await openInvitation(page, "test3")

    // names should be pre-filled, so just clicking RSVP is sufficient
    await page.getByLabel(/no, will celebrate/i).check()
    await page.getByLabel(/comments/i).fill("Lorem ipsum dolor")
    await expect(page.getByLabel(/negative covid test/i)).toHaveCount(0)

    await page.getByText(/submit rsvp/i).click()
    await expect(page.getByText(/not attending/i)).toHaveCount(1)
    await percySnapshot(page, "RSVP page should submit a no response correctly")
    await expectNoA11yViolations(page)

    // Responses should be sticky
    await page.getByText(/edit rsvp/i).click()
    await expect(page.getByLabel(/1st guest/i)).toHaveValue(
      invitation.knownGuests[0]
    )
    await expect(page.getByLabel(/no, will celebrate/i)).toBeChecked()
    await expect(page.getByLabel(/comments/i)).toHaveValue("Lorem ipsum dolor")

    // If we now select Yes for attending, COVID shouldn't be checked
    await page.getByLabel(/yes/i).check()
    await expect(
      page.getByLabel(/covid test within 48 hours/i)
    ).not.toBeChecked()
  })

  test("should submit a yes response correctly", async ({ page }) => {
    // 2 person invitation, with puja
    const { invitation } = await openInvitation(page, "test2")

    await page.getByLabel(/2nd guest/i).fill("Jack Jones")
    await page.getByLabel(/yes/i).check()
    await page.getByLabel(/covid test within 48 hours/i).check()
    await page.getByLabel(/comments/i).fill("Lorem ipsum dolor")
    await page.getByText(/next: specific events/i).click()

    // 5 event sections including haldi
    await expect(page.getByLabel(/both guests are attending/i)).toHaveCount(5)
    await page
      .getByLabel(/haldi/i)
      .getByLabel(invitation.knownGuests[0], { exact: true })
      .check()
    await page
      .getByLabel(/puja/i)
      .getByLabel(/both guests are attending/i)
      .check()
    await page
      .getByLabel(/welcome dinner/i)
      .getByLabel(/both guests are attending/i)
      .check()
    await page
      .getByLabel(/ceremony/i)
      .getByLabel(invitation.knownGuests[0], { exact: true })
      .check()
    await percySnapshot(page, "RSVP page - second page")
    await expectNoA11yViolations(page)

    await page.getByText(/submit rsvp/i).click()
    await expect(page.getByText(/2 guests attending/i)).toHaveCount(1)
    await percySnapshot(page, "RSVP page - attending")
    await expectNoA11yViolations(page)

    // Responses should be sticky
    await page.getByText(/edit rsvp/i).click()
    await expect(page.getByLabel(/2nd guest/i)).toHaveValue("Jack Jones")
    await expect(page.getByLabel(/yes, excited to attend/i)).toBeChecked()
    await expect(page.getByLabel(/covid test within 48 hours/i)).toBeChecked()
    await expect(page.getByLabel(/comments/i)).toHaveValue("Lorem ipsum dolor")
    await page.getByText(/next: specific events/i).click()

    const haldi = page.getByLabel(/haldi/i)
    await expect(
      haldi.getByLabel(/both guests are attending/i)
    ).not.toBeChecked()
    await expect(
      haldi.getByLabel(invitation.knownGuests[0], { exact: true })
    ).toBeChecked()
    await expect(
      haldi.getByLabel("Jack Jones", { exact: true })
    ).not.toBeChecked()

    const puja = page.getByLabel(/puja/i)
    await expect(puja.getByLabel(/both guests are attending/i)).toBeChecked()
    await expect(
      puja.getByLabel(invitation.knownGuests[0], { exact: true })
    ).toBeChecked()
    await expect(puja.getByLabel("Jack Jones", { exact: true })).toBeChecked()

    const welcomeDinner = page.getByLabel(/welcome dinner/i)
    await expect(
      welcomeDinner.getByLabel(/both guests are attending/i)
    ).toBeChecked()
    await expect(
      welcomeDinner.getByLabel(invitation.knownGuests[0], { exact: true })
    ).toBeChecked()
    await expect(
      welcomeDinner.getByLabel("Jack Jones", { exact: true })
    ).toBeChecked()

    const ceremony = page.getByLabel(/ceremony/i)
    await expect(
      ceremony.getByLabel(/both guests are attending/i)
    ).not.toBeChecked()
    await expect(
      ceremony.getByLabel(invitation.knownGuests[0], { exact: true })
    ).toBeChecked()
    await expect(
      ceremony.getByLabel("Jack Jones", { exact: true })
    ).not.toBeChecked()
  })

  test("should update submit count correctly when some guests attend 0 events", async ({
    page,
  }) => {
    // 3 person invitation, only two filled
    await openInvitation(page, "test32")

    await page.getByLabel(/yes/i).check()
    await page.getByLabel(/covid test within 48 hours/i).check()
    await page.getByText(/next: specific events/i).click()

    // findAllByLabelText(...).check() checked every match (one per event section)
    const virat = page.getByLabel("Virat Kohli", { exact: true })
    await expect(virat.first()).toBeAttached()
    for (const checkbox of await virat.all()) {
      await checkbox.check()
    }

    await page.getByText(/submit rsvp/i).click()
    await expect(page.getByText(/1 guest attending/i)).toHaveCount(1)
  })
})
