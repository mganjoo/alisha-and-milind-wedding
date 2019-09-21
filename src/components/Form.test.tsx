import React, { useState } from "react"
import { render, fireEvent } from "@testing-library/react"
import { useForm, RequiredValidator, ValidatorMap, SubmissionMap } from "./Form"
import "@testing-library/jest-dom/extend-expect"

interface TestFormProps {
  required: boolean
  onSubmit: (t: SubmissionMap) => Promise<void>
}

function TestForm({ required, onSubmit }: TestFormProps) {
  const validators: ValidatorMap = required
    ? { textField: [RequiredValidator] }
    : {}
  const [submitted, setSubmitted] = useState(false)
  const callback = (submission: SubmissionMap) =>
    onSubmit(submission).then(() => setSubmitted(true))
  const {
    values,
    dirty,
    submitting,
    handleChange,
    handleBlur,
    handleSubmit,
    registerRef,
  } = useForm(["textField"], validators, callback)
  return (
    <>
      <label>
        text field
        <input
          type="text"
          name="textField"
          value={values.requiredText}
          onChange={handleChange}
          onBlur={handleBlur}
          ref={registerRef}
        />
      </label>
      {dirty.textField && <span>text field is invalid</span>}
      {submitting && <span>Submitting</span>}
      {submitted && <span>Submitted</span>}
      <button onClick={handleSubmit}>Submit</button>
    </>
  )
}

describe("Form", () => {
  it("allows submit only when required field is filled", async () => {
    expect.assertions(2)
    const submissionHandler = (submission: SubmissionMap) => {
      expect(submission.textField).toBe("abc")
      return Promise.resolve()
    }
    const { getByText, getByLabelText, findByText, queryByText } = render(
      <TestForm required={true} onSubmit={submissionHandler} />
    )
    fireEvent.click(getByText("Submit"))
    // Error appears because of validation
    await findByText("text field is invalid")
    fireEvent.change(getByLabelText("text field"), {
      target: { value: "abc" },
    })
    fireEvent.click(getByText("Submit"))
    expect(queryByText("text field is invalid")).not.toBeInTheDocument()
    // Form now submits correctly
    await findByText("Submitted")
  })

  it("submits optional field even when empty", async () => {
    expect.assertions(1)
    const submissionHandler = (submission: SubmissionMap) => {
      expect(submission.textField).toBe("")
      return Promise.resolve()
    }
    const { getByText, findByText } = render(
      <TestForm required={false} onSubmit={submissionHandler} />
    )
    fireEvent.click(getByText("Submit"))
    await findByText("Submitted")
  })

  it("marks invalid field on focus change", async () => {
    const { getByLabelText, queryByText, findByText } = render(
      <TestForm required={true} onSubmit={() => Promise.reject()} />
    )
    expect(queryByText("text field is invalid")).not.toBeInTheDocument()
    fireEvent.focus(getByLabelText("text field"))
    expect(queryByText("text field is invalid")).not.toBeInTheDocument()
    fireEvent.blur(getByLabelText("text field"))
    // Error appears on blur
    await findByText("text field is invalid")
    fireEvent.change(getByLabelText("text field"), {
      target: { value: "abc" },
    })
    // Error disappears when text is added
    expect(queryByText("text field is invalid")).not.toBeInTheDocument()
  })

  it("shows a pending status while submitting only", async () => {
    expect.assertions(1)
    const submissionHandler = () => {
      return new Promise<void>(resolve => setTimeout(resolve, 20))
    }
    const { getByText, getByLabelText, findByText, queryByText } = render(
      <TestForm required={true} onSubmit={submissionHandler} />
    )
    fireEvent.change(getByLabelText("text field"), {
      target: { value: "abc" },
    })
    fireEvent.click(getByText("Submit"))
    await findByText("Submitting")
    await findByText("Submitted")
    expect(queryByText("Submitting")).not.toBeInTheDocument()
  })
})
