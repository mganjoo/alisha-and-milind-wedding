/// <reference types="Cypress" />

describe("save the date website", function() {
  it("should load correctly", function() {
    cy.visit("/save-the-date")
    cy.get("h1").should("contain", "Save the Date")
  })
})
