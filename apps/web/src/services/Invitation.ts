import {
  type Invitation,
  InvitationSchema,
  type Rsvp,
} from "../interfaces/Invitation"
import { getJson, postJson, postLookup } from "./Api"
import { loadInvitation, saveInvitation } from "./Storage"

const invitationsPath = "/api/invitations"

async function parseAndSave(data: unknown): Promise<Invitation | undefined> {
  if (data === undefined) return undefined
  // Once something is returned, check (with error) if the data is valid
  const invitation = InvitationSchema.parse(data)
  await saveInvitation(invitation)
  return invitation
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
  return parseAndSave(
    await getJson(`${invitationsPath}/${encodeURIComponent(code)}`)
  )
}

export async function fetchAndSaveInvitationByEmail(
  email: string
): Promise<Invitation | undefined> {
  // POST with a JSON body, so the email never appears in a URL (or its logs).
  return parseAndSave(
    await postLookup(`${invitationsPath}/lookup`, {
      email: email.trim().toLowerCase(),
    })
  )
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
  return loadInvitation(fetchAndSaveInvitationByCode, refreshOlderThanSecs)
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
  // The server responds with the invitation as updated by this RSVP.
  const updated = InvitationSchema.parse(
    await postJson(
      `${invitationsPath}/${encodeURIComponent(invitation.code)}/rsvps`,
      rsvp
    )
  )
  await saveInvitation(updated)
  return updated
}
