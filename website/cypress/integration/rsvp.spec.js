/// <reference types="Cypress" />

describe("RSVP page", function () {
  let invitations
  let invitees

  function openInvitation(code) {
    const invitation = invitations.find(
      (invitation) => invitation.data.code === code
    ).data
    const invitee = invitees.find((invitee) => invitee.data.code === code)
    cy.get("@email_input").type(invitee.id)
    cy.get("@button").click()
    return { invitation, invitee }
  }

  before(function () {
    cy.request("POST", Cypress.env("SEED_URL"))
      .as("getInvitations")
      .then((response) => {
        invitations = response.body.invitations
        invitees = response.body.invitees
      })
  })

  beforeEach(function () {
    indexedDB.deleteDatabase("am-wedding-store")
    cy.visit("/rsvp")
    cy.injectAxe()
    cy.findByLabelText(/email address/i).as("email_input")
    cy.findByText(/submit/i).as("button")
  })

  it("should prevent submission when fields are unfilled", function () {
    // 2 person invitation
    openInvitation("test2")

    cy.findByLabelText(/name of 1st guest/i).clear()
    cy.findByLabelText(/name of 2nd guest/i).clear()

    cy.findByText(/next: specific events/i).click()
    cy.findByText(/at least one name is required/i).should("exist")
    cy.findByText(/please confirm your attendance/i).should("exist")
    cy.findByText(/please acknowledge the covid policy/i).should("not.exist")
    cy.percySnapshot()
    // Make sure error state is accessible
    cy.checkA11y()

    // filling out fields restores errors
    cy.findByLabelText(/name of 1st guest/i).type("Jack Jones")
    cy.findByText(/at least one name is required/i).should("not.exist")
    cy.findByLabelText(/yes/i).check()
    cy.findByText(/please acknowledge the covid policy/i).should("exist")
    cy.findByLabelText(/covid test within 48 hours/i).check()
    cy.findByText(/please confirm your attendance/i).should("not.exist")
  })

  it("should prevent moving forward if covid policy is not accepted", function () {
    openInvitation("test2")
    cy.findByLabelText(/yes/i).check()
    cy.findByText(/next: specific events/i).click()
    cy.findByText(/please acknowledge the covid policy/i).should("exist")
    cy.percySnapshot()
    cy.findByLabelText(/covid test within 48 hours/i).check()
    cy.findByText(/please confirm your attendance/i).should("not.exist")
  })

  it("should prevent submission if no event attendance is selected", function () {
    // 2 person invitation, with puja
    const { invitation } = openInvitation("test2")

    cy.findByLabelText(/yes/i).check()
    cy.findByLabelText(/covid test within 48 hours/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findByText(/submit rsvp/i).click()

    cy.findByText(/make a selection/i).should("exist")
    cy.percySnapshot()
    // Make sure error state is accessible
    cy.checkA11y()

    // checking at least one field restores errors
    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(invitation.knownGuests[0]).check()
    })
    cy.findByText(/make a selection/i).should("not.exist")
  })

  it("should preserve attendance choices when only name spellings are changed", function () {
    // 3 person invitation
    const { invitation } = openInvitation("test3")

    cy.findByLabelText(/yes/i).check()
    cy.findByLabelText(/covid test within 48 hours/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(invitation.knownGuests[0]).check()
      cy.findByLabelText(invitation.knownGuests[2]).check()
    })

    // go back and forth
    cy.findByText(/back: guest details/i).click()
    cy.findByLabelText(/name of 1st guest/i)
      .clear()
      .type("Jack Jones")
    cy.findByText(/next: specific events/i).click()

    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText("Jack Jones").should("be.checked")
      cy.findByLabelText(invitation.knownGuests[2]).should("be.checked")
    })
  })

  it("should reset attendance choices when guest is removed", function () {
    // 2 person invitation
    const { invitation } = openInvitation("test3")

    cy.findByLabelText(/yes/i).check()
    cy.findByLabelText(/covid test within 48 hours/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(/all guests are attending/i).check()
    })

    // go back and change a name, and go forward
    cy.findByText(/back: guest details/i).click()
    cy.findByLabelText(/name of 2nd guest/i).clear()
    cy.findByText(/next: specific events/i).click()
    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(invitation.knownGuests[0]).should("be.checked")
      cy.findByLabelText(invitation.knownGuests[1]).should("not.exist")
      cy.findByLabelText(invitation.knownGuests[2]).should("be.checked")
    })

    // go back again, and add a new name
    cy.findByText(/back: guest details/i).click()
    cy.findByLabelText(/name of 2nd guest/i).type("Jack Jones")
    cy.findByText(/next: specific events/i).click()
    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(invitation.knownGuests[0]).should("be.checked")
      cy.findByLabelText("Jack Jones").should("not.be.checked")
      cy.findByLabelText(invitation.knownGuests[2]).should("be.checked")
    })
  })

  it("should adapt UI to 1-person case", function () {
    const { invitation } = openInvitation("test1")

    cy.findByLabelText("Name").should("have.value", invitation.knownGuests[0])
    cy.findByLabelText(/yes/i).check()
    cy.findByLabelText(/covid test within 48 hours/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(/attending/i).should("exist")
    })
    cy.percySnapshot()
    cy.checkA11y()

    // should prevent submission if no event is selected
    cy.findByText(/submit rsvp/i).click()
    cy.findByText(/make a selection/i).should("exist")
    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(/attending/i).check()
    })
    cy.findByText(/make a selection/i).should("not.exist")
  })

  it("should adapt UI to 3 or more people", function () {
    // 3 person invitation
    openInvitation("test3")

    cy.findByLabelText(/yes/i).check()
    cy.findByLabelText(/covid test within 48 hours/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findAllByText(/all guests are attending/i).should("exist")
  })

  it("should adapt UI to case where not all names are filled", function () {
    // 3 person invitation, only two filled
    openInvitation("test32")

    cy.findByLabelText(/yes/i).check()
    cy.findByLabelText(/covid test within 48 hours/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findAllByText(/both guests are attending/i).should("exist")
  })

  // This test is more of a unit test for checkbox group functionality
  it("should allow selection and deselection of arbitrary checkboxes", function () {
    const { invitation } = openInvitation("test2")

    cy.findByLabelText(/yes/i).check()
    cy.findByLabelText(/covid test within 48 hours/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findByLabelText(/reception/i).within(() => {
      cy.findByLabelText(/both guests are attending/i).check()
      cy.findByLabelText(/both guests are attending/i).uncheck()
      cy.findByLabelText(invitation.knownGuests[0]).check()
      cy.findByLabelText(invitation.knownGuests[0]).uncheck()
    })
  })

  it("should submit a no response correctly", function () {
    // 3 person invitation
    const { invitation } = openInvitation("test3")

    // names should be pre-filled, so just clicking RSVP is sufficient
    cy.findByLabelText(/no, will celebrate/i).check()
    cy.findByLabelText(/comments/i).type("Lorem ipsum dolor")
    cy.findByLabelText(/negative covid test/i).should("not.exist")

    cy.findByText(/submit rsvp/i).click()
    cy.findByText(/not attending/i).should("exist")
    cy.percySnapshot()
    cy.checkA11y()

    // Responses should be sticky
    cy.findByText(/edit rsvp/i).click()
    cy.findByLabelText(/1st guest/i).should(
      "have.value",
      invitation.knownGuests[0]
    )
    cy.findByLabelText(/no, will celebrate/i).should("be.checked")
    cy.findByLabelText(/comments/i).should("have.value", "Lorem ipsum dolor")

    // If we now select Yes for attending, COVID shouldn't be checked
    cy.findByLabelText(/yes/i).check()
    cy.findByLabelText(/covid test within 48 hours/i).should("not.be.checked")
  })

  it("should submit a yes response correctly", function () {
    // 2 person invitation, with puja
    const { invitation } = openInvitation("test2")

    cy.findByLabelText(/2nd guest/i)
      .clear()
      .type("Jack Jones")
    cy.findByLabelText(/yes/i).check()
    cy.findByLabelText(/covid test within 48 hours/i).check()
    cy.findByLabelText(/comments/i).type("Lorem ipsum dolor")
    cy.findByText(/next: specific events/i).click()

    // 5 event sections including haldi
    cy.findAllByLabelText(/both guests are attending/i).should("have.length", 5)
    cy.findByLabelText(/haldi/i).within(() => {
      cy.findByLabelText(invitation.knownGuests[0]).check()
    })
    cy.findByLabelText(/puja/i).within(() => {
      cy.findByLabelText(/both guests are attending/i).check()
    })
    cy.findByLabelText(/welcome dinner/i).within(() => {
      cy.findByLabelText(/both guests are attending/i).check()
    })
    cy.findByLabelText(/ceremony/i).within(() => {
      cy.findByLabelText(invitation.knownGuests[0]).check()
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
    cy.findByLabelText(/covid test within 48 hours/i).should("be.checked")
    cy.findByLabelText(/comments/i).should("have.value", "Lorem ipsum dolor")
    cy.findByText(/next: specific events/i).click()
    cy.findByLabelText(/haldi/i).within(() => {
      cy.findByLabelText(/both guests are attending/i).should("not.be.checked")
      cy.findByLabelText(invitation.knownGuests[0]).should("be.checked")
      cy.findByLabelText("Jack Jones").should("not.be.checked")
    })
    cy.findByLabelText(/puja/i).within(() => {
      cy.findByLabelText(/both guests are attending/i).should("be.checked")
      cy.findByLabelText(invitation.knownGuests[0]).should("be.checked")
      cy.findByLabelText("Jack Jones").should("be.checked")
    })
    cy.findByLabelText(/welcome dinner/i).within(() => {
      cy.findByLabelText(/both guests are attending/i).should("be.checked")
      cy.findByLabelText(invitation.knownGuests[0]).should("be.checked")
      cy.findByLabelText("Jack Jones").should("be.checked")
    })
    cy.findByLabelText(/ceremony/i).within(() => {
      cy.findByLabelText(/both guests are attending/i).should("not.be.checked")
      cy.findByLabelText(invitation.knownGuests[0]).should("be.checked")
      cy.findByLabelText("Jack Jones").should("not.be.checked")
    })
  })

  it("should update submit count correctly when some guests attend 0 events", function () {
    // 3 person invitation, only two filled
    openInvitation("test32")

    cy.findByLabelText(/yes/i).check()
    cy.findByLabelText(/covid test within 48 hours/i).check()
    cy.findByText(/next: specific events/i).click()

    cy.findAllByLabelText("Virat Kohli").check()

    cy.findByText(/submit rsvp/i).click()
    cy.findByText(/1 guest attending/i).should("exist")
  })
})
