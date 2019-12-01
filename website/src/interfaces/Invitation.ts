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
}

interface Guest {
  name: string
  events: string[]
}

export type RsvpWithTimestamp = Rsvp & { timestampMillis: number }
