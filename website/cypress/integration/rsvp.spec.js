/// <reference types="Cypress" />

describe("RSVP page", function() {
  let invitations

  function openCode(code) {
    cy.get("@code_input").type(code)
    cy.get("@button").click()
  }

  before(function() {
    cy.request("POST", Cypress.env("SEED_URL"))
      .as("getInvitations")
      .then(response => {
        invitations = response.body.records
      })
  })

  beforeEach(function() {
    indexedDB.deleteDatabase("am-wedding-store")
    cy.visit("/rsvp")
    cy.findByLabelText(/invitation code/i).as("code_input")
    cy.findByText(/submit/i).as("button")
  })

  it("should prevent submission when fields are unfilled", function() {
    // 2 person invitation
    openCode("test2")

    cy.findByLabelText(/name of 1st guest/i).clear()
    cy.findByLabelText(/name of 2nd guest/i).clear()

    cy.findByText(/next: specific events/i).click()
    cy.findByText(/at least one name is required/i).should("exist")
    cy.findByText(/please confirm your attendance/i).should("exist")
    cy.percySnapshot()
  })

  it("should prevent submission if no event attendance is selected", function() {
    // 2 person invitation, with mehendi
    openCode("test2")

    cy.findByLabelText(/yes/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findByText(/submit rsvp/i).click()

    cy.findByText(/selections for at least one/i).should("exist")
    cy.percySnapshot()
  })

  it("should adapt UI to 1-person case", function() {
    openCode("test1")

    cy.findByLabelText("Name").should(
      "have.value",
      invitations.find(invitation => invitation.data.code === "test1").data
        .knownGuests[0]
    )
    cy.findByLabelText(/yes/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(/attending/i).should("exist")
    })
    cy.percySnapshot()
  })

  it("should adapt UI to 3 or more people", function() {
    // 3 person invitation
    openCode("test3")

    cy.findByLabelText(/yes/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findAllByText(/all guests are attending/i).should("exist")
  })

  it("should adapt UI to case where not all names are filled", function() {
    // 3 person invitation, only two filled
    openCode("test32")

    cy.findByLabelText(/yes/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findAllByText(/both guests are attending/i).should("exist")
  })

  it("should submit a no response correctly", function() {
    // 3 person invitation
    openCode("test3")

    // names should be pre-filled, so just clicking RSVP is sufficient
    cy.findByLabelText(/no, will celebrate/i).check()

    cy.findByText(/submit rsvp/i).click()
    cy.findByText(/not attending/i).should("exist")
    cy.percySnapshot()
  })

  it("should submit a yes response correctly", function() {
    // 2 person invitation, with mehendi
    openCode("test2")
    const invitation = invitations.find(
      invitation => invitation.data.code === "test2"
    )

    cy.findByLabelText(/2nd guest/i)
      .clear()
      .type("Jack Jones")
    cy.findByLabelText(/yes/i).check()
    cy.findByText(/one more step/i).should("exist")
    cy.findByText(/next: specific events/i).click()

    // 4 event sections for mehendi
    cy.findAllByLabelText(/both guests are attending/i).should("have.length", 4)
    cy.findByLabelText(/mehendi/i).within(() => {
      cy.findByLabelText(/both guests are attending/i).check()
    })
    cy.findByLabelText(/sangeet/i).within(() => {
      cy.findByLabelText(/both guests are attending/i).check()
    })
    cy.findByLabelText(/ceremony/i).within(() => {
      cy.findByLabelText(invitation.data.knownGuests[0]).check()
    })
    cy.percySnapshot("RSVP page - second page")

    cy.findByText(/submit rsvp/i).click()
    cy.findByText(/2 guests attending/i).should("exist")
    cy.percySnapshot("RSVP page - attending")

    // Responses should be sticky
    cy.findByText(/edit rsvp/i).click()
    cy.findByLabelText(/2nd guest/i).should("have.value", "Jack Jones")
    cy.findByLabelText(/yes, excited to attend/i).should("be.checked")
    cy.findByText(/next: specific events/i).click()

    cy.findByLabelText(/mehendi/i).within(() => {
      cy.findByLabelText(/both guests are attending/i).should("be.checked")
      cy.findByLabelText(invitation.data.knownGuests[0]).should("be.checked")
      cy.findByLabelText("Jack Jones").should("be.checked")
    })
    cy.findByLabelText(/sangeet/i).within(() => {
      cy.findByLabelText(/both guests are attending/i).should("be.checked")
      cy.findByLabelText(invitation.data.knownGuests[0]).should("be.checked")
      cy.findByLabelText("Jack Jones").should("be.checked")
    })
    cy.findByLabelText(/ceremony/i).within(() => {
      cy.findByLabelText(/both guests are attending/i).should("not.be.checked")
      cy.findByLabelText(invitation.data.knownGuests[0]).should("be.checked")
      cy.findByLabelText("Jack Jones").should("not.be.checked")
    })
  })
})
