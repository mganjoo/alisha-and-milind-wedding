export interface Invitation {
  code: string
  partyName: string
  numGuests: number
  knownGuests: string[]
  preEvents?: boolean
  latestRsvp?: Rsvp
}

interface Guest {
  name: string
  events: string[]
}

export interface Rsvp {
  attending: boolean
  guests: Guest[]
}
