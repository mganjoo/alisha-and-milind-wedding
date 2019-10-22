import { del } from "idb-keyval"

function getInvitation(invitations, i) {
  return invitations.fixtures[i].data
}

describe("invitation page", function() {
  this.beforeEach(() => {
    cy.wrap(null).then(() => {
      return del("invitation")
    })
    cy.fixture("../../../fixtures/invitations.json").as("invitations")
  })

  it("should load correctly", function() {
    cy.visit(`/invitation/${getInvitation(this.invitations, 0).code}`)
    cy.findByText(
      new RegExp(getInvitation(this.invitations, 0).partyName, "i")
    ).should("exist")
  })

  it("should load different invitation when changing code", function() {
    cy.visit(`/invitation/${getInvitation(this.invitations, 0).code}`)
    cy.findByText(
      new RegExp(getInvitation(this.invitations, 0).partyName, "i")
    ).should("exist")
    cy.visit(`/invitation/${getInvitation(this.invitations, 1).code}`)
    cy.findByText(
      new RegExp(getInvitation(this.invitations, 1).partyName, "i")
    ).should("exist")
  })

  it("should redirect to code entry page on invalid code argument", function() {
    cy.visit(`/invitation/bla`)
    cy.findByText(/welcome to our wedding website/i).should("exist")
  })

  it("should redirect to code entry page on empty code argument", function() {
    cy.visit(`/invitation`)
    cy.findByText(/welcome to our wedding website/i).should("exist")
  })

  it("should load a cached invitation when calling with an invalid argument, when possible", function() {
    cy.visit(`/invitation/${getInvitation(this.invitations, 0).code}`)
    cy.findByText(
      new RegExp(getInvitation(this.invitations, 0).partyName, "i")
    ).should("exist")
    cy.visit(`/invitation/bla`)
    cy.findByText(
      new RegExp(getInvitation(this.invitations, 0).partyName, "i")
    ).should("exist")
    cy.url().should("contain", getInvitation(this.invitations, 0).code)
  })

  it("should load a cached invitation when calling without an argument, when possible", function() {
    cy.visit(`/invitation/${getInvitation(this.invitations, 0).code}`)
    cy.findByText(
      new RegExp(getInvitation(this.invitations, 0).partyName, "i")
    ).should("exist")
    cy.visit(`/invitation`)
    cy.findByText(
      new RegExp(getInvitation(this.invitations, 0).partyName, "i")
    ).should("exist")
    cy.url().should("contain", getInvitation(this.invitations, 0).code)
  })

  it("should avoid making network request if cached invitation exists", function() {
    cy.visit(`/invitation/${getInvitation(this.invitations, 0).code}`)
    cy.findByText(
      new RegExp(getInvitation(this.invitations, 0).partyName, "i")
    ).should("exist")
    cy.server()
    cy.route({
      url: "**/google.firestore.v1.Firestore/**",
      onRequest: () => {
        throw new Error("url should not be called")
      },
    })
    cy.visit(`/invitation/${getInvitation(this.invitations, 0).code}`)
    cy.findByText(
      new RegExp(getInvitation(this.invitations, 0).partyName, "i")
    ).should("exist")
  })

  it("should handle errors correctly", function() {
    cy.visit("/invitation/__reject_request__")
    cy.findByText(/error/i).should("exist")
  })

  it("should show an error if more than one invitation matches code", function() {
    cy.visit("/invitation/__duplicate_code__")
    cy.findByText(/error/i).should("exist")
  })
})
