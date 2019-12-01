import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import { object, boolean, array, string, InferType } from "yup"

admin.initializeApp()

const db = admin.firestore()

const rsvpSchema = object({
  attending: boolean(),
  guests: array().of(
    object({
      name: string(),
      events: array().of(string()),
    })
  ),
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
      const rsvpWithTimestamp = {
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
      } catch (error) {
        console.error(
          `Could not update invitation for code ${code} with latestRsvp`,
          error
        )
      }
    } else {
      console.error("Invalid RSVP:", data, new Error("Invalid RSVP received"))
    }
  })

interface InvitationFixture {
  id: string
  data: Record<string, any>
}

const invitations = require("../fixtures/invitation-fixtures.json") as InvitationFixture[]

/**
 * Seed invitations into the test Firestore database, using a fixtures file.
 */
export const seedInvitations = functions.https.onRequest(async (req, res) => {
  if (req.method === "POST") {
    let batch = db.batch()
    invitations.forEach(invitation =>
      batch.set(
        db.collection("invitations").doc(invitation.id),
        invitation.data
      )
    )
    try {
      await batch.commit()
      res.send({ records: invitations })
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .send({ error: "error occurred while seeding invitations" })
    }
  } else {
    res.status(404).send({ error: "must seed invitations using POST" })
  }
})
