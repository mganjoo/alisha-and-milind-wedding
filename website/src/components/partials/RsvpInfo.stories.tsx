import React from "react"
import {
  InvitationContext,
  makeDummyInvitationContextWrapper,
} from "./Authenticated"
import { Invitation, RsvpWithTimestamp } from "../../interfaces/Invitation"
import RsvpInfo from "./RsvpInfo"
import { action } from "@storybook/addon-actions"

const rsvp: RsvpWithTimestamp = {
  attending: true,
  guests: [
    { name: "Foo Adams", events: ["mehendi", "sangeet"] },
    { name: "Bar Adams", events: ["mehendi", "sangeet"] },
    { name: "Baz Adams", events: ["mehendi", "sangeet"] },
    { name: "Abigail Adams", events: ["mehendi", "sangeet"] },
    { name: "James Adams", events: ["mehendi", "sangeet"] },
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
