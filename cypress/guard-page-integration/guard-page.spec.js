/// <reference types="Cypress" />

describe("guard page-only website", function() {
  it("should load correctly when visiting /", function() {
    cy.visit("/")
    cy.get("h1").should("contain", "Stay Tuned")
  })
})
