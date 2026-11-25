import { expect, type Locator, test } from "@playwright/test"
import { inviteeForCode } from "../support/fixtures.js"

async function fill(control: Locator) {
  return control.evaluate((el) => {
    const style = getComputedStyle(el)
    return {
      background: style.backgroundColor,
      color: style.color,
      image: style.backgroundImage,
    }
  })
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`checked checkboxes and radios render filled (${colorScheme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme })
    await page.goto("/rsvp")
    await page.getByLabel(/email address/i).fill(inviteeForCode("test2").id)
    await page.getByText(/submit/i).click()

    const yes = page.getByLabel(/yes, excited to attend/i)
    const before = await fill(yes)
    await yes.check()
    const radio = await fill(yes)
    expect(radio.background).toBe(radio.color)
    expect(radio.background).not.toBe(before.background)
    expect(radio.image).not.toBe("none")

    const covid = page.getByLabel(/covid test within 48 hours/i)
    await covid.check()
    const checkbox = await fill(covid)
    expect(checkbox.background).toBe(checkbox.color)
    expect(checkbox.image).not.toBe("none")
  })
}
