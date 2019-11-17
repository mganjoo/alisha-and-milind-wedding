import { loadFirestore } from "./Firestore"
import { get, set, del } from "idb-keyval"
import { Invitation, Rsvp } from "../interfaces/Invitation"

const InvitationKey = "invitation"

const invitationsCollection = "invitations"
const rsvpsCollection = "rsvps"

/**
 * Attempts to fetch invitation with provided code and save into indexed DB.
 * Returns a Promise of retrieved invitation, if it exists, or Promise<null>
 * otherwise.
 *
 * @param code invitation code to fetch
 */
export async function fetchAndSaveInvitation(
  code: string
): Promise<Invitation | undefined> {
  const firestore = await loadFirestore()
  const result = await firestore.findById(invitationsCollection, code)
  if (result) {
    const invitation = result.data as Invitation
    await set(InvitationKey, invitation)
    return invitation
  }
  return undefined
}

/**
 * Retrieves a saved invitation from cache, if it exists.
 */
export function loadSavedInvitation(): Promise<Invitation | undefined> {
  return get<Invitation | undefined>(InvitationKey)
}

export function clearSavedInvitation(): Promise<void> {
  return del(InvitationKey)
}

/**
 * Adds an RSVP for a given invitation.
 *
 * @param invitation invitation that is being responded to
 * @param rsvp RSVP identifier
 */
export async function addRsvp(invitation: Invitation, rsvp: Rsvp) {
  const firestore = await loadFirestore()
  await firestore.addWithTimestamp(rsvpsCollection, rsvp, db =>
    db.doc(`${invitationsCollection}/${invitation.code}`)
  )
  // Mirror the change that will also eventually happen server-side
  const newInvitation: Invitation = { ...invitation, latestRsvp: rsvp }
  await set(InvitationKey, newInvitation)
  return newInvitation
}
