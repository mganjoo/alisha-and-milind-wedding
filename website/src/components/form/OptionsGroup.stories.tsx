import React from "react"
import FormikStoryWrapper from "../../utils/FormikStoryWrapper"
import StoryPaddingWrapper from "../../utils/StoryPaddingWrapper"
import OptionsGroup, { Option } from "./OptionsGroup"

export default {
  title: "OptionsGroup",
  decorators: [
    (storyFn: any) => <StoryPaddingWrapper>{storyFn()}</StoryPaddingWrapper>,
  ],
}

const options: Option[] = [
  {
    label: "Apples",
    value: "apples",
  },
  { label: "Bananas", value: "bananas" },
  { label: "Cherries", value: "cherries" },
  { label: "Pears", value: "pears" },
]

export const radioGroup = () => (
  <FormikStoryWrapper initialValues={{ choice: "" }}>
    <OptionsGroup
      name="choice"
      label="Choose from options"
      type="radio"
      options={options}
    />
  </FormikStoryWrapper>
)

export const checkboxGroup = () => (
  <FormikStoryWrapper initialValues={{ choice: "" }}>
    <OptionsGroup
      name="choice"
      label="Choose options"
      type="checkbox"
      options={options}
    />
  </FormikStoryWrapper>
)

export const withSelectAll = () => (
  <FormikStoryWrapper initialValues={{ choice: "" }}>
    <OptionsGroup
      name="choice"
      label="Choose options"
      type="checkbox"
      showSelectAll
      selectAllLabel="Select all fruits"
      options={options}
    />
  </FormikStoryWrapper>
)

export const withCustomLabelId = () => (
  <FormikStoryWrapper initialValues={{ choice: "" }}>
    <p id="custom-label" className="mb-2">
      Custom checkbox
    </p>
    <OptionsGroup
      name="choice"
      label="custom-label"
      labelType="id"
      type="checkbox"
      showSelectAll
      selectAllLabel="Select all fruits"
      options={options}
    />
  </FormikStoryWrapper>
)

export const withValidation = () => (
  <FormikStoryWrapper
    initialValues={{ choice: "" }}
    validate={() => ({ choice: "Invalid field" })}
    validateOnMount
    initialTouched={{ choice: true }}
  >
    <OptionsGroup
      name="choice"
      label="Choose a fruit"
      type="radio"
      options={options}
    />
  </FormikStoryWrapper>
)
