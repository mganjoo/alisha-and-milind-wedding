/// <reference types="Cypress" />

describe("header menu on mobile", function () {
  beforeEach(() => {
    cy.viewport("iphone-6")
    cy.visit("/")
    cy.findByLabelText(/toggle menu/i).as("menu_button")
  })

  it("should not be visible initially", function () {
    cy.get("nav").should("not.be.visible")
  })

  it("toggles correctly when menu button is pressed", function () {
    cy.get("@menu_button").click()
    cy.findByText(/our story/i).should("be.visible")
    cy.get("@menu_button").click()
    cy.get("nav").should("not.be.visible")
  })

  it("closes correctly when clicking outside nav", function () {
    cy.get("@menu_button").click()
    cy.get("nav").should("be.visible")
    cy.contains("Las Vegas").click()
    cy.get("nav").should("not.be.visible")
  })
})
