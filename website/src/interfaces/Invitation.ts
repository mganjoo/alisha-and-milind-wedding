import {
  Array,
  Boolean,
  Literal,
  Number as RNumber,
  Optional,
  Record,
  Static,
  String,
  Union,
} from "runtypes"
import { WeddingEventMarkdown } from "./Event"

/**
 *       Puja  Haldi  Sangeet  Ceremony   Reception
 * f     y     y      y        y          y
 * a     n     y      y        y          y
 * psr   n     y      y        n          y
 * pr    n     y      n        n          y
 * w     n     n      y        y          y
 * sr    n     n      y        n          y
 * r     n     n      n        n          y
 */
const ITypeSchema = Union(
  Literal("f"),
  Literal("a"),
  Literal("psr"),
  Literal("pr"),
  Literal("w"),
  Literal("sr"),
  Literal("r")
)
type IType = Static<typeof ITypeSchema>

const RsvpSchema = Record({
  attending: Boolean,
  guests: Array(
    Record({
      name: String,
      events: Array(String),
    })
  ),
  comments: Optional(String),
})

const MAX_GUESTS = 15
export const InvitationSchema = Record({
  code: String,
  partyName: String,
  numGuests: RNumber.withConstraint(
    (n) => Number.isSafeInteger(n) && n > 0 && n < MAX_GUESTS
  ),
  knownGuests: Array(String),
  itype: ITypeSchema,
  latestRsvp: Optional(
    RsvpSchema.extend({ timestampMillis: RNumber.withConstraint((n) => n > 0) })
  ),
})

export const InviteeSchema = Record({
  name: String,
  code: String,
})

export type Invitation = Static<typeof InvitationSchema>
export type Rsvp = Static<typeof RsvpSchema>

// Whether this event is RSVPable based on invitation status
export function isRsvpable(
  event: WeddingEventMarkdown,
  invitation: Invitation
): boolean {
  const codeMatches = (codes: IType[]) => codes.includes(invitation.itype)
  if (event.frontmatter.shortName === "puja") {
    return codeMatches(["f"])
  } else if (event.frontmatter.shortName === "haldi") {
    return codeMatches(["f", "a", "psr", "pr"])
  } else if (event.frontmatter.shortName === "ceremony") {
    return codeMatches(["f", "a", "w"])
  } else if (event.frontmatter.shortName === "sangeet") {
    return codeMatches(["f", "a", "psr", "w", "sr"])
  } else {
    return true
  }
}

export function invitedToPreEvent(invitation: Invitation): boolean {
  return ["a", "psr", "pr"].includes(invitation.itype)
}
