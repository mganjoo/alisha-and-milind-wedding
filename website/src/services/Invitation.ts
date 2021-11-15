import { doc } from "firebase/firestore"
import {
  Invitation,
  Rsvp,
  InviteeSchema,
  InvitationSchema,
} from "../interfaces/Invitation"
import { loadFirestore } from "./Firestore"
import { saveInvitation, loadInvitation } from "./Storage"

const invitationsCollection = "invitations"
const inviteesCollection = "invitees"
const rsvpsCollection = "rsvps"

/**
 * Attempts to fetch invitation with provided code and save into indexed DB.
 * Returns a Promise of retrieved invitation, if it exists, or Promise<null>
 * otherwise.
 *
 * @param code invitation code to fetch
 */
export async function fetchAndSaveInvitationByCode(
  code: string
): Promise<Invitation | undefined> {
  const firestore = await loadFirestore()
  const result = await firestore.findById(invitationsCollection, code)
  if (result) {
    const data = result.data
    if (InvitationSchema.guard(data)) {
      await saveInvitation(data)
      return data
    }
  }
  return undefined
}

export async function fetchAndSaveInvitationByEmail(
  email: string
): Promise<Invitation | undefined> {
  const firestore = await loadFirestore()
  const result = await firestore.findById(
    inviteesCollection,
    email.toLowerCase()
  )
  if (result) {
    const data = result.data
    if (InviteeSchema.guard(data)) {
      return fetchAndSaveInvitationByCode(data.code)
    }
  }
  return undefined
}

/**
 * Retrieves a saved invitation from cache, if it exists.
 *
 * @param refreshOlderThanSecs if the cached invitation was fetched older than this duration (in secs), fetch again.
 *                             if the value is undefined, then will never re-fetch.
 */
export async function loadSavedInvitation(
  refreshOlderThanSecs?: number
): Promise<Invitation | undefined> {
  return loadInvitation(fetchAndSaveInvitationByCode, refreshOlderThanSecs)
}

/**
 * Adds an RSVP for a given invitation.
 *
 * @param invitation invitation that is being responded to
 * @param rsvp RSVP identifier
 */
export async function addRsvp(
  invitation: Invitation,
  rsvp: Rsvp
): Promise<Invitation> {
  const firestore = await loadFirestore()
  const dataWithTimestamp = await firestore.addWithTimestamp(
    rsvpsCollection,
    rsvp,
    (db) => doc(db, invitationsCollection, invitation.code)
  )
  const latestRsvp = {
    ...rsvp,
    timestampMillis: dataWithTimestamp.createdAt.toMillis(),
  }
  // Mirror the change that will also eventually happen server-side
  const newInvitation: Invitation = { ...invitation, latestRsvp: latestRsvp }
  await saveInvitation(newInvitation)
  return newInvitation
}
