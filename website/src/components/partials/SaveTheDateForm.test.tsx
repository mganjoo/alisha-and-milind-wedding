import { loadFirestore } from "../../services/Firebase"
import { Firestore } from "../../interfaces/Firestore"
import { render, fireEvent, waitForElement } from "@testing-library/react"
import SaveTheDateForm from "./SaveTheDateForm"
import React from "react"
import "@testing-library/jest-dom/extend-expect"

// Mock Firestore to replace submission function
jest.mock("../../services/Firebase")

function mockLoadFirestoreImpl(
  mockAddWithTimestamp: jest.MockedFunction<
    (collection: string, data: Record<string, any>) => Promise<void>
  >
) {
  const mockLoadFirestore = loadFirestore as jest.MockedFunction<
    typeof loadFirestore
  >
  mockLoadFirestore.mockImplementationOnce(() => {
    return Promise.resolve<Firestore>({
      addWithTimestamp: async (
        collection: string,
        data: Record<string, any>
      ) => {
        await mockAddWithTimestamp(collection, data)
        // Reject all submissions to cause DOM change
        throw new Error("submission rejected")
      },
      findByKey: () => Promise.resolve([]),
    })
  })
}

// ContactEmail has some GraphQL queries that must be mocked out
jest.mock("./ContactEmail")

function delayedPromise(timeoutMs: number): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), timeoutMs))
}

describe("SaveTheDateForm", () => {
  it("should submit data correctly", async () => {
    const mockAddWithTimestamp = jest.fn() as jest.MockedFunction<
      (collection: string, data: Record<string, any>) => Promise<void>
    >
    mockLoadFirestoreImpl(mockAddWithTimestamp)

    const { getByLabelText, getByText } = render(<SaveTheDateForm />)

    fireEvent.change(getByLabelText("Name"), {
      target: { value: "Jack Jones" },
    })
    fireEvent.change(getByLabelText("Email address"), {
      target: { value: "jack@example.com" },
    })
    getByText("Submit info").click()

    await waitForElement(() => getByText(/there was a problem/i))

    expect(mockAddWithTimestamp.mock.calls.length).toBe(1)
    expect(mockAddWithTimestamp.mock.calls[0][1]["name"]).toBe("Jack Jones")
    expect(mockAddWithTimestamp.mock.calls[0][1]["email"]).toBe(
      "jack@example.com"
    )
  })

  it("should show 'Submitting...' status on submit", async () => {
    jest.useFakeTimers()

    const mockAddWithTimestamp = jest.fn(
      (_1: string, _2: Record<string, any>) => delayedPromise(5000)
    ) as jest.MockedFunction<
      (collection: string, data: Record<string, any>) => Promise<void>
    >
    mockLoadFirestoreImpl(mockAddWithTimestamp)

    const { getByLabelText, getByText } = render(<SaveTheDateForm />)

    fireEvent.change(getByLabelText("Name"), {
      target: { value: "Jack Jones" },
    })
    fireEvent.change(getByLabelText("Email address"), {
      target: { value: "jack@example.com" },
    })
    getByText("Submit info").click()

    // Assert that "Submitting..." status appears
    const button = await waitForElement(() => getByText(/submitting/i))
    expect(button).toBeInTheDocument()

    jest.runAllTimers()

    await waitForElement(() => getByText(/there was a problem/i))
  })
})
