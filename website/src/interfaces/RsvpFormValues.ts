import { mixed, object, InferType, ObjectSchema } from "yup"
import {
  filterNonEmptyKeys,
  makeIdMap,
  range,
  stringEmpty,
} from "../utils/Utils"
import { WeddingEvent } from "./Event"
import { Invitation, Rsvp } from "@alisha-and-milind-wedding/shared-types"

export type RsvpFormValues = InferType<typeof validationSchema>
export type GuestMap = Record<string, string>

export const validationSchema = object().shape({
  guests: object<GuestMap>().test({
    name: "has-some-guest",
    test: function test(value: GuestMap) {
      return (
        filterNonEmptyKeys(value).length > 0 ||
        this.createError({
          message:
            Object.keys(value).length > 1
              ? "At least one name is required."
              : "Name is required.",
        })
      )
    },
  }),
  attending: mixed<"yes" | "no" | "-">().oneOf(
    ["yes", "no"],
    "Please confirm your attendance."
  ),
  attendees: object<Record<string, string[]>>().when(
    "attending",
    (attending: string, schema: ObjectSchema) => {
      return attending === "yes"
        ? schema.test({
            name: "attending-at-least-one-event",
            test: (value: Record<string, string[]>) =>
              Object.values(value).some(v => v.length > 0),
            message: "Please make selections for at least one event.",
          })
        : schema
    }
  ),
})

/**
 * Returns a Record<string, string[]> which represents a map of event name to list of attendee short IDs.
 *
 * @param events the list of wedding events to generate attendee state for
 * @param includePreEvents whether to include events from the list classified as "pre-events"
 * @param guestIdsForEvent an optional function that returns a set of guest IDs for a particular event
 */
export function resetAttendeesState(
  events: WeddingEvent[],
  includePreEvents: boolean,
  guestIdsForEvent?: (e: WeddingEvent) => string[]
): Record<string, string[]> {
  return events
    .filter(e => (includePreEvents ? true : !e.preEvent))
    .reduce((state, e) => {
      state[e.shortName] = guestIdsForEvent ? guestIdsForEvent(e) : []
      return state
    }, {} as Record<string, string[]>)
}

/**
 * Initializes an initial set of RSVP form values.
 */
export function makeInitialRsvpFormValues(
  invitation: Invitation,
  events: WeddingEvent[]
): RsvpFormValues {
  const initialGuests = makeIdMap(range(invitation.numGuests), (i: number) => {
    if (invitation.latestRsvp) {
      return i < invitation.latestRsvp.guests.length
        ? invitation.latestRsvp.guests[i].name
        : ""
    } else {
      return i < invitation.knownGuests.length ? invitation.knownGuests[i] : ""
    }
  })

  return {
    guests: initialGuests,
    attending: invitation.latestRsvp
      ? invitation.latestRsvp.attending
        ? "yes"
        : "no"
      : "-",
    attendees: resetAttendeesState(
      events,
      !!invitation.preEvents,
      invitation.latestRsvp &&
        ((e: WeddingEvent) =>
          invitation
            .latestRsvp!.guests // filter guests down to people attending event
            .filter(guest => guest.events.includes(e.shortName))
            .flatMap(
              guest =>
                // find ID of guest based on name
                Object.keys(initialGuests).find(
                  id => initialGuests[id] === guest.name
                ) || []
            ))
    ),
  }
}

export function toRsvp(values: RsvpFormValues): Rsvp {
  const attending = values.attending === "yes"
  const guests = Object.keys(values.guests)
    .map(id => ({
      name: values.guests[id],
      events: Object.keys(values.attendees).filter(
        eventName => attending && values.attendees[eventName].includes(id)
      ),
    }))
    .filter(guest => !stringEmpty(guest.name))
  return { guests, attending: attending }
}
