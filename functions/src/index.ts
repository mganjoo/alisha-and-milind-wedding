import * as admin from "firebase-admin"
import * as functions from "firebase-functions"

admin.initializeApp()
const db = admin.firestore()

type Data = Record<string, any> & { createdAt: admin.firestore.Timestamp }

/**
 * Update the "latestRsvp" field of the invitation when a new RSVP is received.
 */
export const updateLatestRsvp = functions.firestore
  .document("invitations/{code}/rsvps/{rsvpId}")
  .onCreate(async (snapshot, context) => {
    const { createdAt, ...data } = snapshot.data() as Data
    const code = context.params.code
    const dataWithTimestamp = {
      ...data,
      timestampMillis: createdAt.toMillis(),
    }
    console.info(`Received RSVP for code ${code}`, dataWithTimestamp)

    // Write latestRsvp to invitation
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
  })

interface Fixture {
  id: string
  data: Record<string, any>
}

const invitations = require("../fixtures/invitation-fixtures.json") as Fixture[]
const invitees = require("../fixtures/invitees-fixtures.json") as Fixture[]

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
