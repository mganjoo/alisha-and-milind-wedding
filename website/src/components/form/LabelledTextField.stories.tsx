import React from "react"
import LabelledTextField from "./LabelledTextField"
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
    <LabelledTextField
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
    <LabelledTextField
      name="name"
      type="text"
      autoComplete="name"
      label="Your Name"
    />
  </FormikStoryWrapper>
)

export const textarea = () => (
  <FormikStoryWrapper initialValues={{ comments: "" }}>
    <LabelledTextField name="comments" type="textarea" label="Comments" />
  </FormikStoryWrapper>
)

export const textareaWithRows = () => (
  <FormikStoryWrapper initialValues={{ comments: "" }}>
    <LabelledTextField
      name="comments"
      type="textarea"
      label="Comments"
      rows={5}
    />
  </FormikStoryWrapper>
)

export const textareaWithValidation = () => (
  <FormikStoryWrapper
    initialValues={{ comments: "" }}
    validate={values =>
      !values.comments ? { comments: "Comments are required" } : {}
    }
    validateOnMount
    initialTouched={{ comments: true }}
  >
    <LabelledTextField name="comments" type="textarea" label="Comments" />
  </FormikStoryWrapper>
)
