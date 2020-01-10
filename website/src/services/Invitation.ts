import { Invitation, Rsvp, Invitee } from "../interfaces/Invitation"
import { loadFirestore } from "./Firestore"
import {
  saveInvitationData,
  loadInvitationData,
  parseInvitationData,
  isCurrentVersion,
} from "./Storage"

const invitationsCollection = "invitations"
const inviteesCollection = "invitees"
const rsvpsCollection = "rsvps"

function saveInvitation(invitation: Invitation): Promise<void> {
  return saveInvitationData({
    version: 1,
    fetchedInvitation: {
      invitation: invitation,
      lastFetched: new Date(),
    },
  })
}

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
    const invitation = result.data as Invitation
    await saveInvitation(invitation)
    return invitation
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
    const { code } = result.data as Invitee
    return fetchAndSaveInvitationByCode(code)
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
  const data = await loadInvitationData()
  if (data) {
    const savedInvitation = parseInvitationData(data)
    const now = new Date().getTime()
    if (
      !isCurrentVersion(data) ||
      (refreshOlderThanSecs &&
        now - savedInvitation.lastFetched.getTime() >
          refreshOlderThanSecs * 1000)
    ) {
      return fetchAndSaveInvitationByCode(savedInvitation.invitation.code)
    } else {
      return savedInvitation.invitation
    }
  } else {
    return undefined
  }
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
    db => db.collection(invitationsCollection).doc(invitation.code)
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
