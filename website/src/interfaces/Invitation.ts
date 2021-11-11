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
 * a - all events (pre-events, sangeet, ceremony, reception)
 * w - all weekend events (sangeet, ceremony, reception)
 * sr - sangeet and reception only
 * r - reception only
 */
const ITypeSchema = Union(
  Literal("a"),
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
  if (event.frontmatter.preEvent) {
    return codeMatches(["a"])
  } else if (event.frontmatter.shortName === "ceremony") {
    return codeMatches(["a", "w"])
  } else if (event.frontmatter.shortName === "sangeet") {
    return codeMatches(["a", "w", "sr"])
  } else {
    return true
  }
}
