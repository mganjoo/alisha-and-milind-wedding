import { testApi } from "./backend.js"
import { invitations, invitees } from "./fixtures.js"

/**
 * Put the fixture invitations/invitees in place once per run, through the
 * site's token-guarded test API. The local harness starts with a fresh
 * database and just seeds; against the deployed demo (E2E_RESET=1) the whole
 * database is wiped first, so every run starts from the same data.
 */
export default async function globalSetup() {
  await testApi(process.env.E2E_RESET === "1" ? "reset" : "seed", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      invitations: invitations.map((i) => i.data),
      invitees: invitees.map((i) => ({ email: i.id, ...i.data })),
    }),
  })
}
