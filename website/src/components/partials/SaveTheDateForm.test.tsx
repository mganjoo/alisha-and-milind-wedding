import {
  loadFirestore,
  Firestore,
  HasServerTimestamp,
} from "../../services/Firestore"
import { render, fireEvent, waitForElement } from "@testing-library/react"
import SaveTheDateForm from "./SaveTheDateForm"
import React from "react"
import firebase from "firebase"
import "@testing-library/jest-dom/extend-expect"

// Mock Firestore to replace submission function
jest.mock("../../services/Firestore")

function mockLoadFirestoreImpl(
  mockAddWithTimestamp: jest.MockedFunction<
    (
      collection: string,
      data: Record<string, any>,
      docRef?: (
        db: firebase.firestore.Firestore
      ) => firebase.firestore.DocumentReference
    ) => Promise<Record<string, any> & HasServerTimestamp>
  >
) {
  const mockLoadFirestore = loadFirestore as jest.MockedFunction<
    typeof loadFirestore
  >
  mockLoadFirestore.mockImplementationOnce(() => {
    return Promise.resolve<Firestore>({
      addWithTimestamp: async (
        collection: string,
        data: Record<string, any>,
        docRef?: (
          db: firebase.firestore.Firestore
        ) => firebase.firestore.DocumentReference
      ) => {
        await mockAddWithTimestamp(collection, data, docRef)
        // Reject all submissions to cause DOM change
        throw new Error("submission rejected")
      },
      findById: () => Promise.resolve(undefined),
      findByKey: () => Promise.resolve([]),
    })
  })
}

// ContactEmail has some GraphQL queries that must be mocked out
jest.mock("./ContactEmail")

function delayedPromise<T>(timeoutMs: number, returnValue: T): Promise<T> {
  return new Promise(resolve =>
    setTimeout(() => resolve(returnValue), timeoutMs)
  )
}

describe("SaveTheDateForm", () => {
  it("should submit data correctly", async () => {
    const mockAddWithTimestamp = jest.fn() as jest.MockedFunction<
      (
        collection: string,
        data: Record<string, any>
      ) => Promise<Record<string, any> & HasServerTimestamp>
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
      (_1: string, record: Record<string, any>) =>
        delayedPromise(5000, {
          ...record,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        })
    ) as jest.MockedFunction<
      (
        collection: string,
        data: Record<string, any>
      ) => Promise<Record<string, any> & HasServerTimestamp>
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
