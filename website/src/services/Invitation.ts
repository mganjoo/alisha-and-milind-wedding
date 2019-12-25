import { Invitation, Rsvp, Invitee } from "../interfaces/Invitation"
import { loadFirestore, Firestore } from "./Firestore"
import {
  saveInvitationData,
  loadInvitationData,
  parseInvitationData,
  isCurrentVersion,
} from "./Storage"

const invitationsCollection = "invitations"
const openedCollection = "opened"
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

async function writeOpened(firestore: Firestore, invitation: Invitation) {
  await firestore.incrementWithTimestamp(
    db => db.collection(openedCollection).doc(invitation.code),
    "openCount",
    1
  )
}

/**
 * Attempts to fetch invitation with provided code and save into indexed DB.
 * Returns a Promise of retrieved invitation, if it exists, or Promise<null>
 * otherwise.
 *
 * @param code invitation code to fetch
 * @aparam trackOpened whether to write opened record
 */
export async function fetchAndSaveInvitationByCode(
  code: string,
  trackOpened?: boolean
): Promise<Invitation | undefined> {
  const firestore = await loadFirestore()
  const result = await firestore.findById(invitationsCollection, code)
  if (result) {
    const invitation = result.data as Invitation
    const savedPromise = saveInvitation(invitation)
    const openedPromise = trackOpened
      ? writeOpened(firestore, invitation)
      : Promise.resolve()
    await Promise.all([savedPromise, openedPromise])
    return invitation
  }
  return undefined
}

export async function fetchAndSaveInvitationByEmail(
  email: string
): Promise<Invitation | undefined> {
  const firestore = await loadFirestore()
  const result = await firestore.findUniqueByKey(
    inviteesCollection,
    "email",
    email
  )
  if (result) {
    const { code } = result.data as Invitee
    return fetchAndSaveInvitationByCode(code, true)
  }
  return undefined
}

/**
 * Retrieves a saved invitation from cache, if it exists.
 *
 * @param refreshOlderThanSecs if the cached invitation was fetched older than this duration (in secs), fetch again.
 *                             if the value is 0, then will never re-fetch.
 */
export async function loadSavedInvitation(
  refreshOlderThanSecs: number = 0
): Promise<Invitation | undefined> {
  const data = await loadInvitationData()
  if (data) {
    const savedInvitation = parseInvitationData(data)
    const now = new Date().getTime()
    if (
      !isCurrentVersion(data) ||
      (refreshOlderThanSecs > 0 &&
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
