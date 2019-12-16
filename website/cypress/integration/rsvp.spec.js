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
    cy.injectAxe()
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
    // Make sure error state is accessible
    cy.checkA11y()

    // filling out fields restores errors
    cy.findByLabelText(/name of 1st guest/i).type("Jack Jones")
    cy.findByText(/at least one name is required/i).should("not.exist")
    cy.findByLabelText(/yes/i).check()
    cy.findByText(/please confirm your attendance/i).should("not.exist")
  })

  it("should prevent submission if no event attendance is selected", function() {
    // 2 person invitation, with mehendi
    openCode("test2")
    const invitation = invitations.find(
      invitation => invitation.data.code === "test2"
    )

    cy.findByLabelText(/yes/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findByText(/submit rsvp/i).click()

    cy.findByText(/selections for at least one/i).should("exist")
    cy.percySnapshot()
    // Make sure error state is accessible
    cy.checkA11y()

    // checking at least one field restores errors
    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(invitation.data.knownGuests[0]).check()
    })
    cy.findByText(/selections for at least one/i).should("not.exist")
  })

  it("should preserve attendance choices when only name spellings are changed", function() {
    // 3 person invitation
    openCode("test3")
    const invitation = invitations.find(
      invitation => invitation.data.code === "test3"
    )

    cy.findByLabelText(/yes/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(invitation.data.knownGuests[0]).check()
      cy.findByLabelText(invitation.data.knownGuests[2]).check()
    })

    // go back and forth
    cy.findByText(/back: guest details/i).click()
    cy.findByLabelText(/name of 1st guest/i)
      .clear()
      .type("Jack Jones")
    cy.findByText(/next: specific events/i).click()

    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText("Jack Jones").should("be.checked")
      cy.findByLabelText(invitation.data.knownGuests[2]).should("be.checked")
    })
  })

  it("should reset attendance choices when guest is removed", function() {
    // 2 person invitation
    openCode("test3")
    const invitation = invitations.find(
      invitation => invitation.data.code === "test3"
    )

    cy.findByLabelText(/yes/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(/all guests are attending/i).check()
    })

    // go back and change a name, and go forward
    cy.findByText(/back: guest details/i).click()
    cy.findByLabelText(/name of 2nd guest/i).clear()
    cy.findByText(/next: specific events/i).click()
    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(invitation.data.knownGuests[0]).should("be.checked")
      cy.findByLabelText(invitation.data.knownGuests[1]).should("not.exist")
      cy.findByLabelText(invitation.data.knownGuests[2]).should("be.checked")
    })

    // go back again, and add a new name
    cy.findByText(/back: guest details/i).click()
    cy.findByLabelText(/name of 2nd guest/i).type("Jack Jones")
    cy.findByText(/next: specific events/i).click()
    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(invitation.data.knownGuests[0]).should("be.checked")
      cy.findByLabelText("Jack Jones").should("not.be.checked")
      cy.findByLabelText(invitation.data.knownGuests[2]).should("be.checked")
    })
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
    cy.checkA11y()

    // should prevent submission if no event is selected
    cy.findByText(/submit rsvp/i).click()
    cy.findByText(/selections for at least one/i).should("exist")
    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(/attending/i).check()
    })
    cy.findByText(/selections for at least one/i).should("not.exist")
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

  // This test is more of a unit test for checkbox group functionality
  it("should allow selection and deselection of arbitrary checkboxes", function() {
    openCode("test2")
    const invitation = invitations.find(
      invitation => invitation.data.code === "test2"
    )

    cy.findByLabelText(/yes/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(/both guests are attending/i).check()
      cy.findByLabelText(/both guests are attending/i).uncheck()
      cy.findByLabelText(invitation.data.knownGuests[0]).check()
      cy.findByLabelText(invitation.data.knownGuests[0]).uncheck()
    })
  })

  it("should submit a no response correctly", function() {
    // 3 person invitation
    openCode("test3")

    // names should be pre-filled, so just clicking RSVP is sufficient
    cy.findByLabelText(/no, will celebrate/i).check()

    cy.findByText(/submit rsvp/i).click()
    cy.findByText(/not attending/i).should("exist")
    cy.percySnapshot()
    cy.checkA11y()
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

    // 5 event sections including mehendi and haldi
    cy.findAllByLabelText(/both guests are attending/i).should("have.length", 5)
    cy.findByLabelText(/haldi/i).within(() => {
      cy.findByLabelText(invitation.data.knownGuests[0]).check()
    })
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
    cy.checkA11y()

    cy.findByText(/submit rsvp/i).click()
    cy.findByText(/2 guests attending/i).should("exist")
    cy.percySnapshot("RSVP page - attending")
    cy.checkA11y()

    // Responses should be sticky
    cy.findByText(/edit rsvp/i).click()
    cy.findByLabelText(/2nd guest/i).should("have.value", "Jack Jones")
    cy.findByLabelText(/yes, excited to attend/i).should("be.checked")
    cy.findByText(/next: specific events/i).click()

    cy.findByLabelText(/haldi/i).within(() => {
      cy.findByLabelText(/both guests are attending/i).should("not.be.checked")
      cy.findByLabelText(invitation.data.knownGuests[0]).should("be.checked")
      cy.findByLabelText("Jack Jones").should("not.be.checked")
    })
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
