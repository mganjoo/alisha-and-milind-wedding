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
  createdAt: object<FirebaseFirestore.Timestamp>().notRequired(),
}).noUnknown()

type Rsvp = InferType<typeof rsvpSchema>

// TODO: figure out a way to unify this interface with what's in website/src/interfaces
type RsvpWithTimestamp = Omit<Rsvp, "createdAt"> & { timestampMillis: number }

/**
 * Update the "latestRsvp" field of the invitation when a new RSVP is received.
 */
export const updateLatestRsvp = functions.firestore
  .document("invitations/{code}/rsvps/{rsvpId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data()
    const valid = await rsvpSchema.isValid(data)
    if (valid) {
      const { createdAt, ...otherRsvpFields }: Rsvp = rsvpSchema.cast(data)
      const code = context.params.code
      const rsvpWithTimestamp: RsvpWithTimestamp = {
        ...otherRsvpFields,
        timestampMillis: createdAt
          ? createdAt.toMillis()
          : new Date().getUTCMilliseconds(),
      }
      console.log(`Received valid RSVP for code ${code}`, rsvpWithTimestamp)

      // Write latestRsvp to invitation
      try {
        await db
          .collection("invitations")
          .doc(code)
          .update({
            latestRsvp: rsvpWithTimestamp,
          })
        console.log(`Updated latest RSVP for code ${code}`)
      } catch {
        console.log(
          `Could not update invitation for code ${code} with latestRsvp`
        )
      }
    } else {
      console.error("Invalid RSVP received:", data)
    }
  })
