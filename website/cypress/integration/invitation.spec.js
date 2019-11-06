import { del } from "idb-keyval"

function getInvitation(invitations, i) {
  return invitations.fixtures[i].data
}

// To reduce test flake
Cypress.config("defaultCommandTimeout", 7000)

describe("invitation tests", function() {
  this.beforeEach(() => {
    cy.wrap(null).then(() => {
      // Delete the indexed DB key each time
      return del("invitation")
    })
    cy.fixture("../../../fixtures/invitations.json").as("invitations")
  })

  describe("load code page", function() {
    it("should load an invitation correctly", function() {
      cy.visit(`/load?c=${getInvitation(this.invitations, 0).code}`)
      cy.findByText(
        new RegExp(getInvitation(this.invitations, 0).partyName, "i")
      ).should("exist")
      cy.url().should("contain", "/invitation")
    })

    it("should load different invitation when changing code", function() {
      cy.visit(`/load?c=${getInvitation(this.invitations, 0).code}`)
      cy.findByText(
        new RegExp(getInvitation(this.invitations, 0).partyName, "i")
      ).should("exist")
      cy.visit(`/load?c=${getInvitation(this.invitations, 1).code}`)
      cy.findByText(
        new RegExp(getInvitation(this.invitations, 1).partyName, "i")
      ).should("exist")
    })

    it("should redirect to code entry page on invalid code argument, with error", function() {
      cy.visit(`/load?c=bla`)
      cy.findByLabelText(/invitation code/i).should("exist")
      cy.findByText(/couldn't find that invitation code/i).should("exist")
    })

    it("should redirect to code entry page on duplicate code, with error", function() {
      // Special trigger code for Firestore
      cy.visit(`/load?c=__duplicate_code__`)
      cy.findByLabelText(/invitation code/i).should("exist")
      cy.findByText(/error retrieving/i).should("exist")
    })

    it("should redirect to code entry page on error", function() {
      // Special trigger code for Firestore
      cy.visit(`/load?c=__reject_request__`)
      cy.findByLabelText(/invitation code/i).should("exist")
      cy.findByText(/error retrieving/i).should("exist")
    })

    it("should redirect to code entry page on empty code argument, without error", function() {
      cy.visit(`/load`)
      cy.findByText(/invitation code/i).should("exist")
      cy.findByText(/couldn't find that invitation code/i).should("not.exist")
    })

    it("should load a cached invitation when calling with an invalid argument, when possible", function() {
      cy.visit(`/load?c=${getInvitation(this.invitations, 0).code}`)
      cy.findByText(
        new RegExp(getInvitation(this.invitations, 0).partyName, "i")
      ).should("exist")
      cy.visit(`/load?c=bla`)
      cy.findByText(
        new RegExp(getInvitation(this.invitations, 0).partyName, "i")
      ).should("exist")
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

  describe("invitation page", function() {
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
    })

    it("should show error on invalid code", function() {
      cy.get("@code_input").type("bla")
      cy.get("@button").click()
      cy.findByText(/couldn't find that invitation code/i).should("exist")
    })

    it("should show error on duplicate code", function() {
      // Special trigger code for Firestore
      cy.get("@code_input").type("__duplicate_code__")
      cy.get("@button").click()
      cy.findByText(/error retrieving/i).should("exist")
    })

    it("should redirect to code entry page on error", function() {
      // Special trigger code for Firestore
      cy.get("@code_input").type("__reject_request__")
      cy.get("@button").click()
      cy.findByText(/error retrieving/i).should("exist")
    })

    it("should show a cached invitation when possible", function() {
      cy.get("@code_input").type(getInvitation(this.invitations, 0).code)
      cy.get("@button").click()
      cy.findByText(
        new RegExp(getInvitation(this.invitations, 0).partyName, "i")
      ).should("exist")
      cy.reload()
      cy.findByText(
        new RegExp(getInvitation(this.invitations, 0).partyName, "i")
      ).should("exist")
    })
  })
})
