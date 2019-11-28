import React, { useContext } from "react"
import { render, waitForElementToBeRemoved } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import Authenticated, { InvitationContext } from "./Authenticated"
import {
  fetchAndSaveInvitation,
  loadSavedInvitation,
} from "../../services/Invitation"
import { Invitation } from "@alisha-and-milind-wedding/shared-types"

jest.mock("../../services/Invitation")

function ShowInvitation() {
  const { invitation } = useContext(InvitationContext)
  return <span>{invitation.partyName}</span>
}

function mockReturnValues(
  loadValue: Invitation | undefined | Promise<Invitation | undefined>,
  fetchValue: Invitation | undefined | Promise<Invitation | undefined>
) {
  const mockLoadSavedInvitation = loadSavedInvitation as jest.MockedFunction<
    typeof loadSavedInvitation
  >
  mockLoadSavedInvitation.mockReturnValueOnce(Promise.resolve(loadValue))

  const mockFetchAndSaveInvitation = fetchAndSaveInvitation as jest.MockedFunction<
    typeof fetchAndSaveInvitation
  >
  mockFetchAndSaveInvitation.mockReturnValueOnce(Promise.resolve(fetchValue))
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
    expect(getByText(/couldn't find that invitation code/i)).toBeInTheDocument()
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
      queryByText(/couldn't find that invitation code/i)
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
