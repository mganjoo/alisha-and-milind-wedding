import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import { useContext } from "react"
import { describe, expect, it, vi } from "vitest"
import type { Invitation } from "../../interfaces/Invitation"
import { loadSavedInvitation } from "../../services/Invitation"
import Authenticated, { InvitationContext } from "./Authenticated"

// Mock core services (Firestore / IndexedDB are never touched)
vi.mock("../../services/Invitation")

function ShowInvitation() {
  const { invitation } = useContext(InvitationContext)
  return <span>{invitation.partyName}</span>
}

describe("Authenticated", () => {
  it("should try to load a cached invitation when no code is provided", async () => {
    const cached: Invitation = {
      code: "abcde",
      partyName: "Cece Parekh & Winston Schmidt",
      numGuests: 2,
      knownGuests: [],
      itype: "w",
    }
    vi.mocked(loadSavedInvitation).mockResolvedValueOnce(cached)
    render(
      <Authenticated>
        <ShowInvitation />
      </Authenticated>
    )
    await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i))
    expect(
      screen.getByText(/Cece Parekh & Winston Schmidt/i)
    ).toBeInTheDocument()
  })

  it("should show login page when no code is provided, with no error", async () => {
    vi.mocked(loadSavedInvitation).mockResolvedValueOnce(undefined)
    render(
      <Authenticated>
        <ShowInvitation />
      </Authenticated>
    )
    await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i))
    expect(
      screen.queryByText(/error retrieving your invitation/i)
    ).not.toBeInTheDocument()
  })
})
