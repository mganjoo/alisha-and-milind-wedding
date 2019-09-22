/// <reference types="Cypress" />

const sizes = ["iphone-6", "macbook-15"]

describe("application", function() {
  sizes.forEach(size => {
    it(`has no detectable a11y violations on ${size} load`, function() {
      cy.viewport(size)
      cy.visit("/save-the-date")
      cy.injectAxe()
      // make the runner wait for the h1 element to load, critical to a11y tests
      cy.get("h1").should("be.visible")
      cy.checkA11y()
    })
  })
})
