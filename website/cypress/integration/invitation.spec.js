/// <reference types="Cypress" />

describe("invitation tests", function() {
  let invitations

  before(function() {
    cy.request("POST", Cypress.env("SEED_URL"))
      .as("getInvitations")
      .then(response => {
        invitations = response.body.records
      })
  })

  beforeEach(function() {
    indexedDB.deleteDatabase("am-wedding-store")
  })

  describe("load code page", function() {
    it("should load an invitation correctly", function() {
      cy.visit(`/load?c=${invitations[0].data.code}`)
      cy.findByText(new RegExp(invitations[0].data.partyName, "i")).should(
        "exist"
      )
      cy.percySnapshot()
    })

    it("should show the full invitation correctly", function() {
      cy.visit(`/load?c=${invitations[0].data.code}&immediate=1`)
      cy.findByText(/enter website/i).should("exist")
      cy.percySnapshot()
    })

    it("should load a cached invitation when possible", function() {
      cy.visit(`/load?c=${invitations[0].data.code}`)
      cy.findByText(new RegExp(invitations[0].data.partyName, "i")).should(
        "exist"
      )
      cy.visit(`/invitation`)
      cy.findByText(new RegExp(invitations[0].data.partyName, "i")).should(
        "exist"
      )
    })
  })

  describe("login page", function() {
    this.beforeEach(function() {
      cy.visit(`/invitation`)
      cy.findByLabelText(/invitation code/i).as("code_input")
      cy.findByText(/submit/i).as("button")
    })

    it("should load an invitation correctly", function() {
      cy.get("@code_input").type(invitations[0].data.code)
      cy.get("@button").click()
      cy.findByText(new RegExp(invitations[0].data.partyName, "i")).should(
        "exist"
      )
    })

    it("should validate empty input", function() {
      cy.get("@button").click()
      cy.findByText(/please enter your invitation code/i).should("exist")
      cy.percySnapshot()
    })

    it("should show error on invalid code", function() {
      cy.get("@code_input").type("bla")
      cy.get("@button").click()
      cy.findByText(/couldn't find that invitation code/i).should("exist")
      cy.percySnapshot()
    })

    it("should redirect to code entry page on error", function() {
      // Special trigger code for Firestore
      cy.get("@code_input").type("__reject_request__")
      cy.get("@button").click()
      cy.findByText(/error retrieving/i).should("exist")
    })
  })
})
