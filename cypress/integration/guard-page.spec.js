/// <reference types="Cypress" />

describe("save the date website", function() {
  it("should load correctly when visiting /", function() {
    cy.visit("/")
    cy.get("h1").should("contain", "Stay Tuned")
  })
})
