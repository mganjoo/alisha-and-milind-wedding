/// <reference types="Cypress" />

describe("save the date form", function() {
  this.beforeEach(function() {
    cy.visit("/save-the-date")
    cy.injectAxe()
    cy.findByText(/submit info/i).as("submit_button")
  })

  it("should load correctly", function() {
    cy.get("h1").should("contain", "Save the Date")
    cy.get("@submit_button").should("be.enabled")
    cy.percySnapshot()
  })

  it("should not submit with empty fields", function() {
    cy.get("@submit_button").click()
    cy.percySnapshot()
    cy.findByText("Name is required.").should("exist")
    cy.focused().should("have.attr", "name", "name")
    // Make sure error state is accessible
    cy.checkA11y()
  })

  // Introduced to catch #287
  it("should correctly focus on the first field with an error", function() {
    cy.get("@submit_button").click()

    // Check that filling data out again works
    cy.focused().type("Rani Mukherjee")
    cy.findByLabelText(/email/i).type("johnny.rose@example.com")

    cy.findByLabelText(/name/i)
      .invoke("val")
      .then(val => expect(val).to.equal("Rani Mukherjee"))
    cy.findByLabelText(/email/i)
      .invoke("val")
      .then(val => expect(val).to.equal("johnny.rose@example.com"))
  })

  it("should fail to submit if even one required field is missing", function() {
    cy.findByLabelText(/name/i).type("Rani Mukherjee")
    cy.get("@submit_button").click()
    cy.findByText("A valid email is required.").should("exist")
    cy.focused().should("have.attr", "name", "email")
  })

  it("should submit successfully when all fields are filled", function() {
    cy.findByLabelText(/name/i).type("Johnny Rose")
    cy.findByLabelText(/email/i).type("johnny.rose@example.com")
    cy.get("@submit_button").click()
    cy.findByText(/thank you/i).should("exist")
    // Make sure submitted state is accessible
    cy.checkA11y()
    cy.percySnapshot()
  })

  it("should handle server-side failures correctly", function() {
    // special string that triggers validation error on server
    cy.findByLabelText(/name/i).type("__reject_submission__")
    cy.findByLabelText(/email/i).type("abc@example.com")
    cy.get("@submit_button").click()
    cy.findByText(/there was a problem/i).should("exist")
    // Make sure failure state is accessible
    cy.checkA11y()
    cy.percySnapshot()
  })
})
