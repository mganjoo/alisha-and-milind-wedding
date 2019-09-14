/// <reference types="Cypress" />

const sizes = ["iphone-6", "macbook-15"]

describe("application", function() {
  sizes.forEach(size => {
    it(`has no detectable a11y violations on ${size} load`, function() {
      cy.viewport(size)
      cy.visit("/full")
      cy.injectAxe()
      // make the runner wait for the h1 element to load, critical to a11y tests
      cy.get("h1").should("be.visible")
      cy.checkA11y()
    })
  })
})

describe("header menu on mobile", function() {
  beforeEach(() => {
    cy.viewport("iphone-6")
    cy.visit("/full")
    cy.injectAxe()
  })

  it("has no detectable a11y violations when open", function() {
    cy.getByLabelText(/toggle menu/i).click()
    cy.checkA11y()
  })
})
