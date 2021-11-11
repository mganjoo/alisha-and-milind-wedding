import { render, waitForElementToBeRemoved } from "@testing-library/react"
import React, { useContext } from "react"
import "@testing-library/jest-dom/extend-expect"
import { Invitation } from "../../interfaces/Invitation"
import { loadInvitation, saveInvitation } from "../../services/Storage"
import {
  mockLoadFirestoreImpl,
  FindByIdFnType,
} from "../../utils/FirestoreMocks"
import Authenticated, { InvitationContext } from "./Authenticated"

// Mock core services
jest.mock("../../services/Firestore")
jest.mock("../../services/Storage")

function ShowInvitation() {
  const { invitation } = useContext(InvitationContext)
  return <span>{invitation.partyName}</span>
}

function mockReturnValues(
  loadValue: Invitation | undefined,
  fetchValue: Invitation | undefined | Promise<Invitation | undefined>
) {
  const mockLoadInvitation = loadInvitation as jest.MockedFunction<
    typeof loadInvitation
  >
  mockLoadInvitation.mockReturnValueOnce(
    Promise.resolve(loadValue ? loadValue : undefined)
  )

  const mockSaveInvitation = saveInvitation as jest.MockedFunction<
    typeof saveInvitation
  >
  mockSaveInvitation.mockReturnValue(Promise.resolve())

  const mockFindById = jest.fn() as jest.MockedFunction<FindByIdFnType>

  const mocks = {
    mockFindById: mockFindById.mockReturnValueOnce(
      Promise.resolve(fetchValue).then((v) => (v ? { data: v } : undefined))
    ),
  }

  mockLoadFirestoreImpl(mocks)
  return mocks
}

// ContactEmail has some GraphQL queries that must be mocked out
jest.mock("./ContactEmail")

describe("Authenticated", () => {
  it("should try to load a cached invitation when no code is provided", async () => {
    mockReturnValues(
      {
        code: "abcde",
        partyName: "Cece Parekh & Winston Schmidt",
        numGuests: 2,
        knownGuests: [],
        itype: "w",
      },
      undefined
    )
    const { getByText, queryByText } = render(
      <Authenticated>
        <ShowInvitation />
      </Authenticated>
    )
    await waitForElementToBeRemoved(() => queryByText(/Loading/i))
    expect(getByText(/Cece Parekh & Winston Schmidt/i)).toBeInTheDocument()
  })

  it("should show login page when no code is provided, with no error", async () => {
    mockReturnValues(undefined, undefined)
    const { queryByText } = render(
      <Authenticated>
        <ShowInvitation />
      </Authenticated>
    )
    await waitForElementToBeRemoved(() => queryByText(/Loading/i))
    expect(
      queryByText(/error retrieving your invitation/i)
    ).not.toBeInTheDocument()
  })
})
