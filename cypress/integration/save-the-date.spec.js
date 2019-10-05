/// <reference types="Cypress" />

const data = require("../fixtures/save-the-date.json")

describe("save the date form", function() {
  this.beforeEach(function() {
    cy.visit("/save-the-date")
    cy.injectAxe()
    cy.getByText(/submit info/i).as("submit_button")
  })

  it("should load correctly", function() {
    cy.get("h1").should("contain", "Save the Date")
    cy.get("@submit_button").should("be.enabled")
    cy.percySnapshot()
  })

  it("should not submit with empty fields", function() {
    cy.get("@submit_button").click()
    cy.percySnapshot()
    cy.getByText("Name is required.").should("exist")
    cy.focused().should("have.attr", "name", "name")
    // Make sure error state is accessible
    cy.checkA11y()
  })

  it("should fail to submit if even one required field is missing", function() {
    cy.getByLabelText(/name/i).type(data.name)
    cy.get("@submit_button").click()
    cy.getByText("A valid email is required.").should("exist")
    cy.focused().should("have.attr", "name", "email")
  })

  it("submits successfully when all fields are filled", function() {
    cy.getByLabelText(/name/i).type(data.name)
    cy.getByLabelText(/email/i).type(data.email)
    cy.get("@submit_button").click()
    cy.getByText(/thank you/i).should("exist")
    // Make sure submitted state is accessible
    cy.checkA11y()
    cy.percySnapshot()
  })
})
