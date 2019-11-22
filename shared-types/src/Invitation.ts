import { object, boolean, array, string, InferType } from "yup"

export interface Invitation {
  code: string
  partyName: string
  numGuests: number
  knownGuests: string[]
  preEvents?: boolean
  latestRsvp?: RsvpWithTimestamp
}

export const rsvpSchema = object({
  attending: boolean(),
  guests: array().of(
    object({
      name: string(),
      events: array().of(string()),
    })
  ),
}).noUnknown()

export type Rsvp = InferType<typeof rsvpSchema>

export type RsvpWithTimestamp = Rsvp & { timestampMillis: number }
