import React from "react"
import LabelledTextInput from "./LabelledTextInput"
import FormikStoryWrapper from "../../utils/FormikStoryWrapper"
import StoryPaddingWrapper from "../../utils/StoryPaddingWrapper"

export default {
  title: "LabelledTextInput",
  decorators: [
    (storyFn: any) => <StoryPaddingWrapper>{storyFn()}</StoryPaddingWrapper>,
  ],
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
