import { Invitation } from "@alisha-and-milind-wedding/shared-types"
import { set, del, get, Store } from "idb-keyval"

const InvitationKey = "invitation"

let store: Store

interface SavedInvitationDataV1 {
  version: 1
  fetchedInvitation: FetchedInvitation
}

function loadStore(): Store {
  if (!store) {
    store = new Store("am-wedding-store", "am-wedding")
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

export function loadInvitationData(): Promise<SavedInvitationData | undefined> {
  return get(InvitationKey, loadStore())
}

export function clearInvitationData(): Promise<void> {
  return del(InvitationKey, loadStore())
}

export function parseInvitationData(
  invitationData: SavedInvitationData
): [DataVersion, FetchedInvitation] {
  return [invitationData.version, invitationData.fetchedInvitation]
}
