/// <reference types="Cypress" />

describe("invitation tests", function () {
  let invitation
  let invitation2
  let email

  before(function () {
    cy.request("POST", Cypress.env("SEED_URL"))
      .as("getInvitations")
      .then((response) => {
        const code = response.body.invitees[0].data.code
        const code2 = response.body.invitees[6].data.code
        email = response.body.invitees[0].id
        invitation = response.body.invitations.find(
          (invitation) => invitation.data.code === code
        ).data
        invitation2 = response.body.invitations.find(
          (invitation) => invitation.data.code === code2
        ).data
      })
  })

  beforeEach(function () {
    indexedDB.deleteDatabase("am-wedding-store")
  })

  describe("load code page", function () {
    it("should load an invitation correctly", function () {
      cy.visit(`/s/invitation/${invitation.code}`)
      cy.findByText(new RegExp(invitation.partyName, "i")).should("exist")
      cy.percySnapshot()
    })

    it("should load a cached invitation when possible", function () {
      cy.visit(`/s/invitation/${invitation.code}`)
      cy.findByText(new RegExp(invitation.partyName, "i")).should("exist")
      cy.visit(`/invitation`)
      cy.findByText(new RegExp(invitation.partyName, "i")).should("exist")
      cy.visit(`/invitation?c=bla`)
      cy.findByText(new RegExp(invitation.partyName, "i")).should("exist")
    })

    it("should load another invitation when a new code is provided", function () {
      cy.visit(`/s/invitation/${invitation.code}`)
      cy.findByText(new RegExp(invitation.partyName, "i")).should("exist")
      cy.visit(`/s/invitation/${invitation2.code}`)
      cy.findByText(new RegExp(invitation2.partyName, "i")).should("exist")
    })

    it("should redirect to home page correctly", function () {
      cy.visit(`/s/home/${invitation.code}`)
      cy.findByText(/see you soon in vegas/i).should("exist")
      cy.visit(`/schedule`)
      cy.findAllByText(/you can find more information/i).should("exist")
    })

    it("should show login page when a code is not found", function () {
      cy.visit(`/s/invitation/bla`)
      cy.findByLabelText(/email address/i).should("exist")
    })
  })

  describe("login page", function () {
    this.beforeEach(function () {
      cy.visit(`/invitation`)
      cy.findByLabelText(/email address/i).as("email_input")
      cy.findByText(/submit/i).as("button")
    })

    it("should load an invitation correctly", function () {
      cy.get("@email_input").type(email)
      cy.get("@button").click()
      cy.findByText(new RegExp(invitation.partyName, "i")).should("exist")
    })

    it("should load an invitation correctly when email is different case", function () {
      cy.get("@email_input").type(email.toUpperCase())
      cy.get("@button").click()
      cy.findByText(new RegExp(invitation.partyName, "i")).should("exist")
    })

    it("should validate empty input", function () {
      cy.get("@button").click()
      cy.findByText(/please enter a valid email/i).should("exist")
      cy.percySnapshot()
    })

    it("should show error on invalid email", function () {
      cy.get("@email_input").type("bla@example.com")
      cy.get("@button").click()
      cy.findByText(/couldn’t find an invitation/i).should("exist")
      cy.percySnapshot()
    })

    it("should redirect to email entry page on error", function () {
      // Special trigger code for Firestore
      cy.get("@email_input").type("__reject_request__@example.com")
      cy.get("@button").click()
      cy.findByText(/error retrieving/i).should("exist")
    })

    it("should show an error for inactive email", function () {
      // Known inactive email
      cy.get("@email_input").type("test_inactive@example.com")
      cy.get("@button").click()
      cy.findByText(/error retrieving/i).should("exist")
    })
  })
})
