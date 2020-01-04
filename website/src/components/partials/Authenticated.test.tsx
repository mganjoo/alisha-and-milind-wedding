import { render, waitForElementToBeRemoved } from "@testing-library/react"
import React, { useContext } from "react"
import "@testing-library/jest-dom/extend-expect"
import { Invitation } from "../../interfaces/Invitation"
import {
  loadInvitationData,
  parseInvitationData,
  isCurrentVersion,
  saveInvitationData,
} from "../../services/Storage"
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
  fetchValue: Invitation | undefined | Promise<Invitation | undefined>,
  lastFetched?: Date
) {
  const lastFetchedDate = lastFetched || new Date()
  const mockLoadInvitationData = loadInvitationData as jest.MockedFunction<
    typeof loadInvitationData
  >
  mockLoadInvitationData.mockReturnValueOnce(
    Promise.resolve(
      loadValue
        ? {
            version: 1,
            fetchedInvitation: {
              invitation: loadValue,
              lastFetched: lastFetchedDate,
            },
          }
        : undefined
    )
  )
  if (loadValue) {
    const mockParseInvitationData = parseInvitationData as jest.MockedFunction<
      typeof parseInvitationData
    >
    mockParseInvitationData.mockReturnValueOnce({
      invitation: loadValue,
      lastFetched: lastFetchedDate,
    })
  }

  const mockIsCurrentVersion = isCurrentVersion as jest.MockedFunction<
    typeof isCurrentVersion
  >
  mockIsCurrentVersion.mockReturnValue(true)

  const mockSaveInvitationData = saveInvitationData as jest.MockedFunction<
    typeof saveInvitationData
  >
  mockSaveInvitationData.mockReturnValue(Promise.resolve())

  const mockFindById = jest.fn() as jest.MockedFunction<FindByIdFnType>

  const mocks = {
    mockFindById: mockFindById.mockReturnValueOnce(
      Promise.resolve(fetchValue).then(v => (v ? { data: v } : undefined))
    ),
  }

  mockLoadFirestoreImpl(mocks)
  return mocks
}

// ContactEmail has some GraphQL queries that must be mocked out
jest.mock("./ContactEmail")

describe("Authenticated", () => {
  it("should load an invitation correctly", async () => {
    mockReturnValues(undefined, {
      code: "abcde",
      partyName: "Cece Parekh & Winston Schmidt",
      numGuests: 2,
      knownGuests: [],
    })
    const { getByText, queryByText } = render(
      <Authenticated initialCode="abcde">
        <ShowInvitation />
      </Authenticated>
    )
    await waitForElementToBeRemoved(() => queryByText(/Loading/i))
    expect(getByText(/Cece Parekh & Winston Schmidt/i)).toBeInTheDocument()
  })

  it("should try to load a cached invitation when no code is provided", async () => {
    mockReturnValues(
      {
        code: "abcde",
        partyName: "Cece Parekh & Winston Schmidt",
        numGuests: 2,
        knownGuests: [],
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

  it("should override cached invitation when a different code is provided", async () => {
    mockReturnValues(
      {
        code: "abcde",
        partyName: "Cece Parekh & Winston Schmidt",
        numGuests: 2,
        knownGuests: [],
      },
      {
        code: "defgh",
        partyName: "Jessica Day",
        numGuests: 1,
        knownGuests: [],
      }
    )
    const { getByText, queryByText } = render(
      <Authenticated initialCode="defgh">
        <ShowInvitation />
      </Authenticated>
    )
    await waitForElementToBeRemoved(() => queryByText(/Loading/i))
    expect(getByText(/Jessica Day/i)).toBeInTheDocument()
  })

  it("should fall back to cached invitation when a code is not found", async () => {
    mockReturnValues(
      {
        code: "abcde",
        partyName: "Cece Parekh & Winston Schmidt",
        numGuests: 2,
        knownGuests: [],
      },
      undefined
    )
    const { getByText, queryByText } = render(
      <Authenticated initialCode="defgh">
        <ShowInvitation />
      </Authenticated>
    )
    await waitForElementToBeRemoved(() => queryByText(/Loading/i))
    expect(getByText(/Cece Parekh & Winston Schmidt/i)).toBeInTheDocument()
  })

  it("should show login page when a code is not found", async () => {
    mockReturnValues(undefined, undefined)
    const { getByText, queryByText } = render(
      <Authenticated initialCode="abcde">
        <ShowInvitation />
      </Authenticated>
    )
    await waitForElementToBeRemoved(() => queryByText(/Loading/i))
    expect(getByText(/error retrieving your invitation/i)).toBeInTheDocument()
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

  it("should show login page when there is an error", async () => {
    mockReturnValues(undefined, Promise.reject("error"))
    const { getByText, queryByText } = render(
      <Authenticated initialCode="bla">
        <ShowInvitation />
      </Authenticated>
    )
    await waitForElementToBeRemoved(() => queryByText(/Loading/i))
    expect(getByText(/error retrieving/i)).toBeInTheDocument()
  })
})
