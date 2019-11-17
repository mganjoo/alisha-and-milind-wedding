import * as functions from "firebase-functions"
import { object, boolean, array, string, InferType } from "yup"
import * as admin from "firebase-admin"

admin.initializeApp()

const db = admin.firestore()

const rsvpSchema = object({
  attending: boolean(),
  guests: array()
    .of(
      object({
        name: string().required(),
        events: array().of(string().required()),
      })
    )
    .required(),
  // Timestamp is validated by Firestore security rules
  createdAt: object(),
}).noUnknown()

type Rsvp = InferType<typeof rsvpSchema>

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
      console.log(`Received valid RSVP for code ${code}`, rsvp)

      // Write latestRsvp to invitation
      await db
        .collection("invitations")
        .doc(code)
        .set(
          {
            latestRsvp: rsvp,
          },
          { merge: true }
        )
      console.log(`Updated latest RSVP for code ${code}`)
    } else {
      console.error("Invalid RSVP received:", data)
    }
  })
