import { readFileSync } from "node:fs"

export interface Fixture<T = Record<string, unknown>> {
  id: string
  data: T
}

export interface InvitationData {
  code: string
  partyName: string
  numGuests: number
  knownGuests: string[]
  itype: string
  inactive?: boolean
}

export interface InviteeData {
  code: string
  name: string
}

const load = <T>(name: string): Fixture<T>[] =>
  JSON.parse(
    readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8")
  )

export const invitations = load<InvitationData>("invitation-fixtures.json")
export const invitees = load<InviteeData>("invitees-fixtures.json")

export function invitationByCode(code: string): InvitationData {
  const found = invitations.find((i) => i.data.code === code)
  if (!found) throw new Error(`No invitation fixture with code ${code}`)
  return found.data
}

export function inviteeForCode(code: string): Fixture<InviteeData> {
  const found = invitees.find((i) => i.data.code === code)
  if (!found) throw new Error(`No invitee fixture with code ${code}`)
  return found
}
