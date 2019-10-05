import React, { useState } from "react"
import { render, fireEvent } from "@testing-library/react"
import { useForm, FieldConfig, SubmissionMap } from "./Form"

import "@testing-library/jest-dom/extend-expect"

interface TestFormProps {
  required: boolean
  onSubmit: (t: SubmissionMap) => Promise<void>
}

function TestForm({ required, onSubmit }: TestFormProps) {
  const fields: FieldConfig[] = [
    {
      name: "textField",
      validator: value =>
        required && value === "" ? "text field is invalid" : null,
    },
  ]
  const [submitted, setSubmitted] = useState(false)
  const callback = (submission: SubmissionMap) =>
    onSubmit(submission).then(() => {
      setSubmitted(true)
    })
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    registerRef,
  } = useForm(fields, callback)
  return (
    <form onSubmit={handleSubmit}>
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
      {errors.textField && <span>{errors.textField}</span>}
      {submitted && <span>Submitted</span>}
      <button>Submit</button>
    </form>
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
})
