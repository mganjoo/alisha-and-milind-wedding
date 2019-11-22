import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import {
  rsvpSchema,
  Rsvp,
  RsvpWithTimestamp,
} from "@alisha-and-milind-wedding/shared-types"

admin.initializeApp()

const db = admin.firestore()

/**
 * Update the "latestRsvp" field of the invitation when a new RSVP is received.
 */
export const updateLatestRsvp = functions.firestore
  .document("invitations/{code}/rsvps/{rsvpId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data()
    const valid = await rsvpSchema.isValid(data)
    if (valid) {
      const rsvp: Rsvp = rsvpSchema.cast(data)
      const code = context.params.code
      const rsvpWithTimestamp: RsvpWithTimestamp = {
        ...rsvp,
        timestampMillis: new Date().getTime(),
      }
      console.info(`Received valid RSVP for code ${code}`, rsvpWithTimestamp)

      // Write latestRsvp to invitation
      try {
        await db
          .collection("invitations")
          .doc(code)
          .update({
            latestRsvp: rsvpWithTimestamp,
          })
        console.info(`Updated latest RSVP for code ${code}`)
      } catch {
        console.error(
          new Error(
            `Could not update invitation for code ${code} with latestRsvp`
          )
        )
      }
    } else {
      console.error("Invalid RSVP:", data, new Error("Invalid RSVP received"))
    }
  })
