function getInvitation(invitations, i) {
  return invitations.fixtures[i].data
}

// To reduce test flake
Cypress.config("defaultCommandTimeout", 7000)

describe("authentication tests", function() {
  this.beforeEach(() => {
    indexedDB.deleteDatabase("am-wedding-store")
    cy.fixture("../../../fixtures/invitations.json").as("invitations")
  })

  describe("load code page", function() {
    it("should load an invitation correctly", function() {
      cy.visit(`/load?c=${getInvitation(this.invitations, 0).code}`)
      cy.findByText(
        new RegExp(getInvitation(this.invitations, 0).partyName, "i")
      ).should("exist")
      cy.percySnapshot()
    })

    it.only("should show the full invitation correctly", function() {
      cy.visit(`/load?c=${getInvitation(this.invitations, 0).code}&immediate=1`)
      cy.findByText(/enter website/i).should("exist")
      cy.percySnapshot()
    })

    it("should load a cached invitation when possible", function() {
      cy.visit(`/load?c=${getInvitation(this.invitations, 0).code}`)
      cy.findByText(
        new RegExp(getInvitation(this.invitations, 0).partyName, "i")
      ).should("exist")
      cy.visit(`/invitation`)
      cy.findByText(
        new RegExp(getInvitation(this.invitations, 0).partyName, "i")
      ).should("exist")
    })
  })

  describe("login page", function() {
    this.beforeEach(function() {
      cy.visit(`/invitation`)
      cy.findByLabelText(/invitation code/i).as("code_input")
      cy.findByText(/submit/i).as("button")
    })

    it("should load an invitation correctly", function() {
      cy.get("@code_input").type(getInvitation(this.invitations, 0).code)
      cy.get("@button").click()
      cy.findByText(
        new RegExp(getInvitation(this.invitations, 0).partyName, "i")
      ).should("exist")
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
