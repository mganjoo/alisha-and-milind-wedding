import { Invitation } from "../interfaces/Invitation"
import { set, del, get, Store } from "idb-keyval"

const InvitationKey = "invitation"

let store: Store

interface SavedInvitationDataV1 {
  version: 1
  fetchedInvitation: FetchedInvitation
}

// V0 data was stored as Invitation directly; this helps type guard against that
function isInvitation(
  invitationData: SavedInvitationData
): invitationData is Invitation {
  return (
    (invitationData as Invitation).code !== undefined &&
    (invitationData as Invitation).numGuests !== undefined
  )
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
export type SavedInvitationData = Invitation | SavedInvitationDataV1
type DataVersion = 0 | 1
export const currentDataVersion: DataVersion = 1

export interface FetchedInvitation {
  invitation: Invitation
  lastFetched: Date
}

// Always support only the latest version for writes
export function saveInvitatationData(
  data: SavedInvitationDataV1
): Promise<void> {
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
  if (isInvitation(invitationData)) {
    return [0, { invitation: invitationData, lastFetched: new Date(0) }]
  } else {
    return [invitationData.version, invitationData.fetchedInvitation]
  }
}