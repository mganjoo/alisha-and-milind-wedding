import { render, fireEvent, waitForElement } from "@testing-library/react"
import firebase from "firebase"
import React from "react"
import "@testing-library/jest-dom/extend-expect"
import {
  mockLoadFirestoreImpl,
  AddWithTimestampFnType,
} from "../../utils/FirestoreMocks"
import SaveTheDateForm from "./SaveTheDateForm"

// Mock Firestore to replace submission function
jest.mock("../../services/Firestore")

// These partials have GraphQL queries that must be mocked out
jest.mock("./ContactEmail")
jest.mock("./SaveTheDateLinks")

function delayedPromise<T>(timeoutMs: number, returnValue: T): Promise<T> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(returnValue), timeoutMs)
  )
}

describe("SaveTheDateForm", () => {
  it("should submit data correctly", async () => {
    const mockAddWithTimestamp = jest.fn(
      (_1: string, record: Record<string, any>) =>
        Promise.resolve({
          ...record,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        })
    ) as jest.MockedFunction<AddWithTimestampFnType>
    mockLoadFirestoreImpl({ mockAddWithTimestamp })

    const { getByLabelText, getByText } = render(<SaveTheDateForm />)

    fireEvent.change(getByLabelText("Name"), {
      target: { value: "Jack Jones" },
    })
    fireEvent.change(getByLabelText("Email address"), {
      target: { value: "jack@example.com" },
    })
    getByText("Submit info").click()

    await waitForElement(() => getByText(/thank you/i))

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
    ) as jest.MockedFunction<AddWithTimestampFnType>
    mockLoadFirestoreImpl({ mockAddWithTimestamp })

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

    await waitForElement(() => getByText(/thank you/i))
  })
})
