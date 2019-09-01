/// <reference types="Cypress" />

const sizes = {
  // 320x568
  mobile: "iphone-5",
  // Tailwind "sm"
  small: [640, 855],
  // 768x1024 (Tailwind "md")
  medium: "ipad-2",
  // iPad Pro (Tailwind "lg")
  large: [1024, 1366],
  // Tailwind "xl"
  xlarge: "macbook-13",
}

describe("header", function() {
  for (const key in sizes) {
    it(`should match previous screenshot at ${key} size`, function() {
      const size = sizes[key]
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }
      cy.visit("/our-story") // so we can get an "active" underline
      cy.get("h1").should("be.visible")
      cy.matchImageSnapshot({ blackout: ["main"] }) // we only care about <header>
    })
  }

  it("should match previous screenshot at mobile size when menu is open", function() {
    cy.viewport("iphone-5")
    cy.visit("/our-story")
    cy.getByLabelText(/toggle menu/i)
      .as("menu_button")
      .click()
    cy.get("@menu_button").blur()
    cy.matchImageSnapshot({ blackout: ["main"] }) // we only care about <header>
  })
})
