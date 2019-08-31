/// <reference types="Cypress" />

describe("header menu on mobile", function() {
  beforeEach(() => {
    cy.viewport("iphone-6")
    cy.visit("/")
    cy.get('button[aria-label="Toggle Menu"]').as("menu_button")
  })

  it("should not be visible initially", function() {
    cy.get("nav").should("not.be.visible")
  })

  it("toggles correctly when menu button is pressed", function() {
    cy.get("@menu_button").click()
    cy.get("nav").should("be.visible")
    cy.get("@menu_button").click()
    cy.get("nav").should("not.be.visible")
  })

  it("closes correctly when clicking outside nav", function() {
    cy.get("@menu_button").click()
    cy.get("nav").should("be.visible")
    cy.contains("San Mateo").click()
    cy.get("nav").should("not.be.visible")
  })
})
