import yn from "yn"

export interface Invitation {
  code: string
  partyName: string
  numGuests: number
  knownGuests: string[]
  preEvents?: boolean
  latestRsvp?: RsvpWithTimestamp
}

export interface Rsvp {
  attending: boolean
  guests: Guest[]
  comments?: string
}

export interface Invitee {
  name: string
  code: string
}

interface Guest {
  name: string
  events: string[]
}

export type RsvpWithTimestamp = Rsvp & { timestampMillis: number }

// Whether this invitation is eligible to submit RSVPs for pre-events.
export function shouldAcceptPreEventRsvp(invitation: Invitation): boolean {
  return !!(
    yn(process.env.GATSBY_ENABLE_PRE_EVENT_RSVP) && invitation.preEvents
  )
}
