/// <reference types="Cypress" />

describe("header menu on mobile", function() {
  beforeEach(() => {
    cy.viewport("iphone-6")
    cy.visit("/full")
    cy.findByLabelText(/toggle menu/i).as("menu_button")
  })

  it("should not be visible initially", function() {
    cy.get("nav").should("not.be.visible")
  })

  it.skip("toggles correctly when menu button is pressed", function() {
    cy.get("@menu_button").click()
    cy.findByText(/our story/i).should("be.visible")
    cy.get("@menu_button").click()
    cy.get("nav").should("not.be.visible")
  })

  it.skip("closes correctly when clicking outside nav", function() {
    cy.get("@menu_button").click()
    cy.get("nav").should("be.visible")
    cy.contains("San Mateo").click()
    cy.get("nav").should("not.be.visible")
  })
})
