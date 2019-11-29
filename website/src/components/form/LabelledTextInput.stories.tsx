import React from "react"
import LabelledTextInput from "./LabelledTextInput"
import FormikStoryWrapper from "../../utils/FormikStoryWrapper"

export default {
  title: "LabelledTextInput",
  decorators: [(storyFn: any) => <div className="p-4">{storyFn()}</div>],
}

export const main = () => (
  <FormikStoryWrapper initialValues={{ name: "" }}>
    <LabelledTextInput
      name="name"
      type="text"
      autoComplete="name"
      label="Your Name"
    />
  </FormikStoryWrapper>
)

export const withValidation = () => (
  <FormikStoryWrapper
    initialValues={{ name: "" }}
    validate={values => (!values.name ? { name: "Name is required" } : {})}
    validateOnMount
    initialTouched={{ name: true }}
  >
    <LabelledTextInput
      name="name"
      type="text"
      autoComplete="name"
      label="Your Name"
    />
  </FormikStoryWrapper>
)
