import { loadFirestore } from "./Firestore"
import { Invitation, Rsvp } from "../interfaces/Invitation"
import {
  saveInvitatationData,
  currentDataVersion,
  loadInvitationData,
  parseInvitationData,
} from "./Storage"

const invitationsCollection = "invitations"
const rsvpsCollection = "rsvps"

function saveInvitation(invitation: Invitation): Promise<void> {
  return saveInvitatationData({
    version: 1,
    fetchedInvitation: {
      invitation: invitation,
      lastFetched: new Date(),
    },
  })
}

// 1 hour fetch window
const fetchWindowInMs = 60 * 60 * 1000

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
    await saveInvitation(invitation)
    return invitation
  }
  return undefined
}

/**
 * Retrieves a saved invitation from cache, if it exists.
 *
 * @param refreshOld if true, will attempt to reload from cache if value is too old
 */
export async function loadSavedInvitation(
  refreshOld: boolean = false
): Promise<Invitation | undefined> {
  const data = await loadInvitationData()
  if (data) {
    const [version, savedInvitation] = parseInvitationData(data)
    const now = new Date().getTime()
    if (
      version !== currentDataVersion ||
      (refreshOld &&
        now - savedInvitation.lastFetched.getTime() > fetchWindowInMs)
    ) {
      console.log("Refetching stale invitation")
      return fetchAndSaveInvitation(savedInvitation.invitation.code)
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
    db => db.doc(`${invitationsCollection}/${invitation.code}`)
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
