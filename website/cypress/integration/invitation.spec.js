/// <reference types="Cypress" />

describe("invitation tests", function() {
  let invitation
  let code
  let email

  before(function() {
    cy.request("POST", Cypress.env("SEED_URL"))
      .as("getInvitations")
      .then(response => {
        code = response.body.invitees[0].data.code
        email = response.body.invitees[0].id
        invitation = response.body.invitations.find(
          invitation => invitation.data.code === code
        ).data
      })
  })

  beforeEach(function() {
    indexedDB.deleteDatabase("am-wedding-store")
  })

  describe("load code page", function() {
    it("should load an invitation correctly", function() {
      cy.visit(`/load?c=${invitation.code}`)
      cy.findByText(new RegExp(invitation.partyName, "i")).should("exist")
      cy.percySnapshot()
    })

    it("should show the full invitation correctly", function() {
      cy.visit(`/load?c=${invitation.code}&immediate=1`)
      cy.findByText(/enter website/i).should("exist")
      cy.percySnapshot()
    })

    it("should load a cached invitation when possible", function() {
      cy.visit(`/load?c=${invitation.code}`)
      cy.findByText(new RegExp(invitation.partyName, "i")).should("exist")
      cy.visit(`/invitation`)
      cy.findByText(new RegExp(invitation.partyName, "i")).should("exist")
    })

    it("should show an error when loading an inactive invitation", function() {
      cy.visit(`/load?c=test_inactive`)
      cy.findByText(/error retrieving/i).should("exist")
    })
  })

  describe("login page", function() {
    this.beforeEach(function() {
      cy.visit(`/invitation`)
      cy.findByLabelText(/email address/i).as("email_input")
      cy.findByText(/submit/i).as("button")
    })

    it("should load an invitation correctly", function() {
      cy.get("@email_input").type(email)
      cy.get("@button").click()
      cy.findByText(new RegExp(invitation.partyName, "i")).should("exist")
    })

    it("should validate empty input", function() {
      cy.get("@button").click()
      cy.findByText(/please enter a valid email/i).should("exist")
      cy.percySnapshot()
    })

    it("should show error on invalid email", function() {
      cy.get("@email_input").type("bla@example.com")
      cy.get("@button").click()
      cy.findByText(/couldn’t find an invitation/i).should("exist")
      cy.percySnapshot()
    })

    it("should redirect to email entry page on error", function() {
      // Special trigger code for Firestore
      cy.get("@email_input").type("__reject_request__@example.com")
      cy.get("@button").click()
      cy.findByText(/error retrieving/i).should("exist")
    })

    it("should show an error for inactive email", function() {
      // Known inactive email
      cy.get("@email_input").type("test_inactive@example.com")
      cy.get("@button").click()
      cy.findByText(/error retrieving/i).should("exist")
    })
  })
})
