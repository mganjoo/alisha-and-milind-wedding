import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import { invitations, invitees, events } from "./fixtures"
import { google } from "googleapis"
import { Credentials } from "google-auth-library"
import * as dayjs from "dayjs"
import * as utc from "dayjs/plugin/utc"

dayjs.extend(utc)

admin.initializeApp()
const db = admin.firestore()

/**
 * Configuration for OAuth authentication.
 * - googleapi.client_id = Google API client ID,
 * - googleapi.client_secret = Google API client secret
 */
const ClientId = functions.config().googleapi.client_id
const ClientSecret = functions.config().googleapi.client_secret

/**
 * Configuration for sheet to update with RSVP information
 * - rsvps.spreadsheet_id = https://docs.google.com/spreadsheets/d/<spreadsheetId>/...
 * - rsvps.table_range = A1 notation of range containing RSVPs
 */
const SpreadsheetId = functions.config().rsvps.spreadsheet_id
const TableRange = functions.config().rsvps.table_range

// Redirect URI after authentication is complete. Defined by `oauthCallback` Cloud Function.
const RedirectUri = `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com/oauthCallback`

// Scopes for Google Sheets access (read and write).
const Scopes = ["https://www.googleapis.com/auth/spreadsheets"]

// OAuth client for Google Sheets access.
const oAuth2Client = new google.auth.OAuth2(ClientId, ClientSecret, RedirectUri)

// Reference to Sheets API tokens
const getApiTokensRef = () => db.collection("config").doc("apiTokens")

// Locally cached oAuth tokens
let oauthTokens: Credentials | undefined

// Returns true if this is a test project (relevant for seeding fixture data)
const isTestProject = () =>
  /^test-[a-zA-z0-9-]+$/.test(process.env.GCLOUD_PROJECT || "")

interface Guest {
  name: string
  events: string[]
}

async function getAuthorizedClient() {
  if (oauthTokens) {
    return oAuth2Client
  }
  const snapshot = await getApiTokensRef().get()
  oauthTokens = snapshot.data()
  if (oauthTokens) {
    oAuth2Client.setCredentials(oauthTokens)
    return oAuth2Client
  } else {
    return undefined
  }
}

/**
 * Update the "latestRsvp" field of the invitation with information
 * from an incoming RSVP.
 */
async function writeLatestRsvp(
  data: admin.firestore.DocumentData,
  code: string
) {
  try {
    const { createdAt, ...otherData } = data
    const dataWithTimestamp = {
      ...otherData,
      timestampMillis: (createdAt as admin.firestore.Timestamp).toMillis(),
    }
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

async function appendRsvpToSheet(
  id: string,
  data: admin.firestore.DocumentData,
  code: string
) {
  try {
    const auth = await getAuthorizedClient()
    if (auth) {
      const snapshot = await db
        .collection("invitations")
        .doc(code)
        .get()
      const invitation = snapshot.data()
      if (invitation) {
        const sheets = google.sheets({ version: "v4", auth })

        // Prepare data
        const eventCounts: Record<string, number> = {}
        events.forEach(event => {
          eventCounts[
            event
          ] = data.guests.filter((guest: { events: string[] }) =>
            guest.events.includes(event)
          ).length
        })
        const row = [
          id,
          code,
          invitation.partyName,
          data.attending,
          dayjs(data.createdAt.toDate())
            .utc()
            .format("YYYY-MM-DD HH:mm:ss"),
          data.comments || "",
          eventCounts["haldi"],
          eventCounts["mehndi"],
          eventCounts["sangeet"],
          eventCounts["ceremony"],
          eventCounts["reception"],
          data.guests[0] ? data.guests[0].name : "",
          data.guests[1] ? data.guests[1].name : "",
          data.guests[2] ? data.guests[2].name : "",
          data.guests[3] ? data.guests[3].name : "",
          data.guests[4] ? data.guests[4].name : "",
          data.guests[5] ? data.guests[5].name : "",
        ]

        // Append new row at end
        await sheets.spreadsheets.values.append({
          spreadsheetId: SpreadsheetId,
          range: TableRange,
          valueInputOption: "USER_ENTERED",
          insertDataOption: "INSERT_ROWS",
          requestBody: {
            values: [row],
          },
        })

        console.info(`Successfully appended RSVP to sheet`)

        // Append to mail collection
        await admin
          .firestore()
          .collection("mail")
          .add({
            to: "alisha.and.milind+rsvps@gmail.com",
            message: {
              subject: `New RSVP received: ${invitation.partyName}`,
              html: `
<p>Attending: ${data.attending ? "yes" : "no"}</p>
<p>Code: ${code}</p>
<p>Comments: ${data.comments || "(none)"}</p>
<ul>
${data.guests
  .map((guest: Guest) => `<li>${guest.name}: ${guest.events.join(", ")}</li>`)
  .join("\n")}
</ul>
`,
            },
          })

        console.info(`Successfully queued notification email`)
      } else {
        console.error(`Could not load invitation for code ${code}`)
      }
    }
  } catch (error) {
    console.error(`Error appending RSVP to spreadsheet for code ${code}`, error)
  }
}

export const onCreateRsvp = functions.firestore
  .document("invitations/{code}/rsvps/{rsvpId}")
  .onCreate(async (snapshot, context) => {
    const code = context.params.code
    const data = snapshot.data()
    if (data) {
      console.info(`Received RSVP for code ${code}`, data)
      await Promise.all([
        writeLatestRsvp(data, code),
        appendRsvpToSheet(snapshot.id, data, code),
      ])
    }
  })

/**
 * Seed invitations and invitees into the test Firestore database, using a fixtures file.
 */
export const seedInvitations = functions.https.onRequest(async (req, res) => {
  if (req.method === "POST") {
    if (isTestProject()) {
      try {
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
        await batch.commit()
        res.send({ invitations: invitations, invitees: invitees })
      } catch (error) {
        console.error(error)
        res.status(500).send("Error occurred while seeding data")
      }
    } else {
      res
        .status(200)
        .send("Seeding fixture data is only supported for test projects")
    }
  } else {
    res.status(200).send("Must seed data using POST")
  }
})

/**
 * Endpoint to authorize Google API credentials and trigger saving in Firestore (via oauthCallback).
 */
export const authGoogleApi = functions.https.onRequest(async (_req, res) => {
  res.set("Cache-Control", "private, max-age=0, s-maxage=0")
  res.redirect(
    oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: Scopes,
      prompt: "consent",
    })
  )
})

/**
 * Endpoint for Google OAuth client to trigger once OAuth authorization is complete.
 * Saves credentials to Firestore.
 */
export const oauthCallback = functions.https.onRequest(async (req, res) => {
  res.set("Cache-Control", "private, max-age=0, s-maxage=0")
  const code: string = req.query.code
  try {
    const { tokens } = await oAuth2Client.getToken(code)
    await getApiTokensRef().set(tokens)
    return res.status(200).send("Success. You can now close this page.")
  } catch (error) {
    return res.status(400).send(error)
  }
})
