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
    // TODO: take snapshot
  })

  it("should not submit with empty fields", function() {
    cy.get("@submit_button").click()
    // TODO: take snapshot
    cy.getByText("Name is required.").should("exist")
    cy.focused().should("have.attr", "name", "name")
    // Make sure error state is accessible
    cy.checkA11y()
  })

  it("should fail to submit if even one required field is missing", function() {
    cy.getByLabelText(/name/i).type(data.name)
    cy.getByLabelText(/email/i).type(data.email)
    cy.getByLabelText(/street address/i).type(data.address)
    cy.getByLabelText(/zip/i).type(data.zip)
    cy.get("@submit_button").click()
    cy.getByText("City is required.").should("exist")
    cy.focused().should("have.attr", "name", "city")
  })

  it("submits successfully when all fields are filled", function() {
    cy.getByLabelText(/name/i).type(data.name)
    cy.getByLabelText(/email/i).type(data.email)
    cy.getByLabelText(/street address/i).type(data.address)
    cy.getByLabelText(/city/i).type(data.city)
    cy.getByLabelText(/state/i).type(data.state)
    cy.getByLabelText(/zip/i).type(data.zip)
    cy.getByLabelText(/country/i)
      .clear()
      .type(data.country)
    cy.get("@submit_button").click()
    cy.getByText(/thank you/i).should("exist")
    // Make sure submitted state is accessible
    cy.checkA11y()
    // TODO: take snapshot
  })
})
