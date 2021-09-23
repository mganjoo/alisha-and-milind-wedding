import { createStore, set, del, get, UseStore } from "idb-keyval"
import { Invitation } from "../interfaces/Invitation"

const InvitationKey = "invitation"
const InvitationCodeKey = "code"

let store: UseStore

interface SavedInvitationDataV1 {
  version: 1
  fetchedInvitation: FetchedInvitation
}

function loadStore(): UseStore {
  if (!store) {
    store = createStore("am-wedding-store", "am-wedding")
  }
  return store
}

/* Public interfaces */

// Versioned union for evolving schema
// Bump these every time there is a schema change
export type SavedInvitationData = SavedInvitationDataV1
type DataVersion = 1
export const currentDataVersion: DataVersion = 1

export interface FetchedInvitation {
  invitation: Invitation
  lastFetched: Date
}

// Always support only the latest version for writes
export function saveInvitationData(data: SavedInvitationDataV1): Promise<void> {
  return set(InvitationKey, data, loadStore())
}

export function saveInvitationCode(code: string) {
  try {
    sessionStorage.setItem(InvitationCodeKey, code)
  } catch {
    // Saving invitation code failed; ignore error
    console.warn("could not acess session storage")
  }
}

export function loadInvitationData(): Promise<SavedInvitationData | undefined> {
  return get(InvitationKey, loadStore())
}

export function loadInvitationCode() {
  try {
    return sessionStorage.getItem(InvitationCodeKey)
  } catch {
    // Loading from session storage failed
    console.warn("could not access session storage")
    return null
  }
}

export async function clearInvitationData(): Promise<void> {
  return del(InvitationKey, loadStore()).catch(() =>
    // Ignore attempts to clear if IndexedDB is inaccessible
    console.warn("could not access local DB")
  )
}

export function parseInvitationData(
  invitationData: SavedInvitationData
): FetchedInvitation {
  return invitationData.fetchedInvitation
}

export function isCurrentVersion(invitationData: SavedInvitationData): boolean {
  return invitationData.version === 1
}
