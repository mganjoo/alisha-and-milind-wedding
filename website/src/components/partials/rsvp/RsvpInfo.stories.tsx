import { action } from "@storybook/addon-actions"
import React from "react"
import { Invitation, RsvpWithTimestamp } from "../../../interfaces/Invitation"
import {
  InvitationContext,
  makeDummyInvitationContextWrapper,
} from "../Authenticated"
import RsvpInfo from "./RsvpInfo"

const rsvp: RsvpWithTimestamp = {
  attending: true,
  guests: [
    { name: "Foo Adams", events: ["mehndi", "sangeet"] },
    { name: "Bar Adams", events: ["mehndi", "sangeet"] },
    { name: "Baz Adams", events: ["mehndi", "sangeet"] },
    { name: "Abigail Adams", events: ["mehndi", "sangeet"] },
    { name: "James Adams", events: ["mehndi", "sangeet"] },
  ],
  timestampMillis: new Date().getTime(),
}

const invitation: Invitation = {
  code: "abcdefgh",
  partyName: "Foo Adams & Family",
  numGuests: 2,
  knownGuests: ["Foo Adams", "Bar Adams"],
  latestRsvp: rsvp,
}

export default {
  title: "RsvpInfo",
}

export const main = () => (
  <InvitationContext.Provider
    value={makeDummyInvitationContextWrapper(invitation)}
  >
    <RsvpInfo handleEditRsvp={action("start editing RSVP")} />
  </InvitationContext.Provider>
)

export const notAttending = () => (
  <InvitationContext.Provider
    value={makeDummyInvitationContextWrapper({
      ...invitation,
      latestRsvp: { ...rsvp, attending: false },
    })}
  >
    <RsvpInfo handleEditRsvp={action("start editing RSVP")} />
  </InvitationContext.Provider>
)
