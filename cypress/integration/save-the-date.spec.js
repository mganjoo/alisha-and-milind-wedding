/// <reference types="Cypress" />

describe("save the date form", function() {
  this.beforeEach(function() {
    cy.visit("/save-the-date")
    cy.getByText(/submit info/i).as("submit_button")
  })

  it("should load correctly", function() {
    cy.get("h1").should("contain", "Save the Date")
    // TODO: take snapshot
  })

  it("should not submit with empty fields", function() {
    cy.get("@submit_button").click()
    // TODO: take snapshot
    cy.findByText("Name is required.").should("exist")
    cy.focused().should("have.attr", "name", "name")
  })

  it("should fail to submit if even one required field is missing", function() {
    cy.getByLabelText(/name/i).type("Jack Jones")
    cy.getByLabelText(/email/i).type("jack@gmail.com")
    cy.getByLabelText(/street address/i).type("123 ABC Avenue")
    cy.getByLabelText(/zip/i).type("12345")
    cy.get("@submit_button").click()
    cy.findByText("City is required.").should("exist")
    cy.focused().should("have.attr", "name", "city")
  })
})
