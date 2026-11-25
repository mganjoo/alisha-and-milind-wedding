import { z } from "zod"
import type { WeddingEventMarkdown } from "./Event"

/**
 *       Puja  Haldi  Sangeet  Ceremony   Reception
 * a     y     y      y        y          y
 * psr   y     y      y        n          y
 * pr    y     y      n        n          y
 * w     n     n      y        y          y
 * ow    n     n      n        y          y
 * sr    n     n      y        n          y
 * r     n     n      n        n          y
 */
export const ITypeSchema = z.enum(["a", "psr", "pr", "w", "ow", "sr", "r"])
type IType = z.infer<typeof ITypeSchema>

const RsvpSchema = z.object({
  attending: z.boolean(),
  guests: z.array(
    z.object({
      name: z.string(),
      events: z.array(z.string()),
    })
  ),
  comments: z.string().optional(),
})

const MAX_GUESTS = 15
export const InvitationSchema = z.object({
  code: z.string(),
  partyName: z.string(),
  numGuests: z
    .number()
    .refine((n) => Number.isSafeInteger(n) && n > 0 && n < MAX_GUESTS),
  knownGuests: z.array(z.string()),
  itype: ITypeSchema,
  latestRsvp: RsvpSchema.extend({
    timestampMillis: z.number().refine((n) => n > 0),
  }).optional(),
})

export const InviteeSchema = z.object({
  name: z.string(),
  code: z.string(),
})

export type Invitation = z.infer<typeof InvitationSchema>
export type Rsvp = z.infer<typeof RsvpSchema>

// Whether this event is RSVPable based on invitation status
export function isRsvpable(
  event: WeddingEventMarkdown,
  invitation: Invitation
): boolean {
  const codeMatches = (codes: IType[]) => codes.includes(invitation.itype)
  if (
    event.frontmatter.shortName === "puja" ||
    event.frontmatter.shortName === "haldi"
  ) {
    return codeMatches(["a", "psr", "pr"])
  } else if (event.frontmatter.shortName === "sangeet") {
    return codeMatches(["a", "psr", "w", "sr"])
  } else if (event.frontmatter.shortName === "ceremony") {
    return codeMatches(["a", "w", "ow"])
  } else {
    return true
  }
}
