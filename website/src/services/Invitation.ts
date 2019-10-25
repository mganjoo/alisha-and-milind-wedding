import { loadFirestore } from "./Firebase"
import { get, set, del } from "idb-keyval"

export interface Invitation {
  code: string
  partyName: string
  guests: string[]
}

const InvitationKey = "invitation"

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
  const records = await firestore.findByKey("invitations", "code", code)

  if (records.length === 1) {
    const invitation = records[0] as Invitation
    await set(InvitationKey, invitation)
    return invitation
  } else if (records.length > 1) {
    throw new Error("more than one invitation found with same code")
  } else {
    return undefined
  }
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
