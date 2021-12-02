import { bool, mixed, object, string } from "yup"
import { Invitation, isRsvpable, Rsvp } from "../interfaces/Invitation"
import {
  filterNonEmptyKeys,
  makeIdMap,
  range,
  stringEmpty,
} from "../utils/Utils"
import { WeddingEventMarkdown } from "./Event"

export interface RsvpFormValues {
  guests: Record<string, string>
  attending: "yes" | "no" | "-" | undefined
  declaration: boolean | undefined
  attendees: Record<string, string[]>
  comments: string | undefined
}
export type GuestMap = Record<string, string>

export const validationSchema = object()
  .required()
  .shape({
    guests: object()
      .required()
      .test({
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
    declaration: bool().when("attending", {
      is: "yes",
      then: bool()
        .required("Please acknowledge the COVID policy for the event.")
        .oneOf([true], "Please acknowledge the COVID policy for the event."),
      otherwise: bool().notRequired(),
    }),
    attendees: object()
      .required()
      .when("attending", (attending: string, schema: any) => {
        return attending === "yes"
          ? schema.test({
              name: "attending-at-least-one-event",
              test: (value: Record<string, string[]>) =>
                Object.values(value).some((v) => v.length > 0),
              message: "Please make a selection.",
            })
          : schema
      }),
    comments: string().notRequired(),
  })

/**
 * Returns a Record<string, string[]> which represents a map of event name to list of attendee short IDs.
 *
 * @param events the list of wedding events to generate attendee state for
 * @param invitation invitation for party (to be used to determine pre-events state)
 * @param guestIdsForEvent an function that returns a set of guest IDs to initialize for a particular event
 */
export function resetAttendeesState(
  events: WeddingEventMarkdown[],
  invitation: Invitation,
  guestIdsForEvent: (e: WeddingEventMarkdown) => string[]
): Record<string, string[]> {
  return events
    .filter((e) => isRsvpable(e, invitation))
    .reduce((state, e) => {
      state[e.frontmatter.shortName] = guestIdsForEvent(e)
      return state
    }, {} as Record<string, string[]>)
}

/**
 * Initializes an initial set of RSVP form values.
 */
export function makeInitialRsvpFormValues(
  invitation: Invitation,
  events: WeddingEventMarkdown[]
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
    declaration:
      invitation.latestRsvp && invitation.latestRsvp.attending
        ? true
        : undefined,
    attendees: resetAttendeesState(
      events,
      invitation,
      (e: WeddingEventMarkdown) =>
        invitation.latestRsvp
          ? invitation.latestRsvp.guests // filter guests down to people attending event
              .filter((guest) => guest.events.includes(e.frontmatter.shortName))
              .flatMap(
                (guest) =>
                  // find ID of guest based on name
                  Object.keys(initialGuests).find(
                    (id) => initialGuests[id] === guest.name
                  ) || []
              )
          : []
    ),
    comments:
      (invitation.latestRsvp &&
        invitation.latestRsvp.comments &&
        invitation.latestRsvp.comments.trim()) ||
      "",
  }
}

export function toRsvp(values: RsvpFormValues): Rsvp {
  const attending = values.attending === "yes"
  const guests = Object.keys(values.guests)
    .map((id) => ({
      name: values.guests[id],
      events: Object.keys(values.attendees).filter(
        (eventName) => attending && values.attendees[eventName].includes(id)
      ),
    }))
    .filter((guest) => !stringEmpty(guest.name))
  return Object.assign(
    {
      guests,
      attending,
    },
    !values.comments || values.comments.trim() === ""
      ? {}
      : { comments: values.comments }
  )
}
