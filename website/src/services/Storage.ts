import { createStore, set, del, get, UseStore } from "idb-keyval"
import { InstanceOf, Literal, Record, Static } from "runtypes"
import { Invitation, InvitationSchema } from "../interfaces/Invitation"

const InvitationKey = "invitation"
const InvitationCodeKey = "code"

let store: UseStore

function loadStore(): UseStore {
  if (!store) {
    store = createStore("am-wedding-store", "am-wedding")
  }
  return store
}

const FetchedInvitationSchema = Record({
  invitation: InvitationSchema,
  lastFetched: InstanceOf(Date),
})
const SavedInvitationDataSchema = Record({
  // Bump version every time there is a schema change
  version: Literal(2),
  fetchedInvitation: FetchedInvitationSchema,
})

type SavedInvitationData = Static<typeof SavedInvitationDataSchema>

export async function saveInvitation(invitation: Invitation): Promise<void> {
  const data: SavedInvitationData = {
    version: 2,
    fetchedInvitation: {
      invitation: invitation,
      lastFetched: new Date(),
    },
  }
  try {
    await set(InvitationKey, data, loadStore())
  } catch {
    // Try saving code to session storage
    try {
      sessionStorage.setItem(InvitationCodeKey, invitation.code)
    } catch {
      // Saving invitation code failed; ignore error
      console.warn("could not access session storage")
    }
  }
}

/**
 * Load a saved invitation from cache, if it exists.
 * @param newerThanSecs Number of seconds beyond which to retrieve a new invitation copy
 * @returns an Invitation instance
 */
export function loadInvitation(
  refresh: (code: string) => Promise<Invitation | undefined>,
  newerThanSecs?: number
): Promise<Invitation | undefined> {
  return get(InvitationKey, loadStore())
    .then((data) => {
      if (SavedInvitationDataSchema.guard(data)) {
        const now = new Date().getTime()
        if (
          newerThanSecs &&
          now - data.fetchedInvitation.lastFetched.getTime() >
            newerThanSecs * 1000
        ) {
          return refresh(data.fetchedInvitation.invitation.code)
        } else {
          return data.fetchedInvitation.invitation
        }
      } else {
        return undefined
      }
    })
    .catch(() => {
      // Try fetching code from session storage and retrieving that way
      const code = loadInvitationCode()
      return code ? refresh(code) : undefined
    })
}

function loadInvitationCode() {
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
