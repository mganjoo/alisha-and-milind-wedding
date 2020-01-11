import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import { invitations, invitees } from "./fixtures"

admin.initializeApp()
const db = admin.firestore()

/**
 * Update the "latestRsvp" field of the invitation with information
 * from an incoming RSVP.
 */
async function writeLatestRsvp(
  data: admin.firestore.DocumentData,
  code: string
) {
  const { createdAt, ...otherData } = data
  const dataWithTimestamp = {
    ...otherData,
    timestampMillis: (createdAt as admin.firestore.Timestamp).toMillis(),
  }
  try {
    await db
      .collection("invitations")
      .doc(code)
      .update({
        latestRsvp: dataWithTimestamp,
      })
    console.info(`Updated latest RSVP for code ${code}`)
  } catch (error) {
    console.error(
      `Could not update invitation for code ${code} with latestRsvp`,
      error
    )
  }
}

export const onCreateRsvp = functions.firestore
  .document("invitations/{code}/rsvps/{rsvpId}")
  .onCreate(async (snapshot, context) => {
    const code = context.params.code
    const data = snapshot.data()
    if (data) {
      console.info(`Received RSVP for code ${code}`, data)
      await writeLatestRsvp(data, code)
    }
  })

/**
 * Seed invitations and invitees into the test Firestore database, using a fixtures file.
 */
export const seedInvitations = functions.https.onRequest(async (req, res) => {
  if (req.method === "POST") {
    const batch = db.batch()
    invitations.forEach(invitation =>
      batch.set(
        db.collection("invitations").doc(invitation.id),
        invitation.data
      )
    )
    invitees.forEach(invitee =>
      batch.set(db.collection("invitees").doc(invitee.id), invitee.data)
    )
    try {
      await batch.commit()
      res.send({ invitations: invitations, invitees: invitees })
    } catch (error) {
      console.error(error)
      res.status(500).send({ error: "Error occurred while seeding data" })
    }
  } else {
    res.status(404).send({ error: "Must seed data using POST" })
  }
})
