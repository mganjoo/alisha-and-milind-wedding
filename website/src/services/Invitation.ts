import { loadFirestore } from "./Firebase"
import { get, set, del } from "idb-keyval"
import { Invitation, Rsvp } from "../interfaces/Invitation"
import { QueryResult } from "../interfaces/Firestore"

const InvitationKey = "invitation"

const invitationsCollection = "invitations"
const rsvpsCollection = "rsvps"

async function fetchInvitation(code: string): Promise<QueryResult | undefined> {
  const firestore = await loadFirestore()
  const records = await firestore.findByKey(invitationsCollection, "code", code)

  if (records.length === 1) {
    return records[0]
  } else if (records.length > 1) {
    throw new Error("more than one invitation found with same code")
  } else {
    return undefined
  }
}

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
  const result = await fetchInvitation(code)
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

export async function addRsvp(code: string, rsvp: Rsvp) {
  const firestore = await loadFirestore()
  const result = await fetchInvitation(code)
  if (!result) {
    throw new Error("could not find invitation entry for given code")
  } else {
    return firestore.addWithTimestamp(rsvpsCollection, rsvp, result.ref)
  }
}
