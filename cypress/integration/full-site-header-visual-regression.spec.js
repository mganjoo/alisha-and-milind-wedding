/// <reference types="Cypress" />

const sizes = {
  // 320x568
  mobile: "iphone-5",
  // Set all heights to a maximum of 720, since that is the height passed to XVFB in headless mode
  // See https://github.com/cypress-io/cypress/issues/2102#issuecomment-402901382
  // Tailwind "sm"
  small: [640, 720],
  // Tailwind "md"
  medium: [768, 720],
  // iPad Pro (Tailwind "lg")
  large: [1024, 720],
  // Tailwind "xl"
  xlarge: [1280, 720],
}

describe("header", function() {
  for (const key in sizes) {
    it.skip(`should match previous screenshot at ${key} size`, function() {
      const size = sizes[key]
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }
      cy.visit("/full/our-story") // so we can get an "active" underline
      cy.get("h1").should("be.visible")
      cy.matchImageSnapshot({ blackout: ["main"] }) // we only care about <header>
    })
  }

  it.skip("should match previous screenshot at mobile size when menu is open", function() {
    cy.viewport("iphone-5")
    cy.visit("/full/our-story")
    cy.getByLabelText(/toggle menu/i)
      .as("menu_button")
      .click()
    cy.get("@menu_button").blur()
    cy.matchImageSnapshot({ blackout: ["main"] }) // we only care about <header>
  })
})
