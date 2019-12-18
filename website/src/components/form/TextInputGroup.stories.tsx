import FormikStoryWrapper from "../../utils/FormikStoryWrapper"
import React from "react"
import TextInputGroup from "./TextInputGroup"
import StoryPaddingWrapper from "../../utils/StoryPaddingWrapper"

export default {
  title: "TextInputGroup",
  decorators: [
    (storyFn: any) => <StoryPaddingWrapper>{storyFn()}</StoryPaddingWrapper>,
  ],
}

export const main = () => (
  <FormikStoryWrapper
    initialValues={{
      characters: {},
    }}
  >
    <TextInputGroup
      label="Enter names of Batman characters"
      groupName="characters"
      fieldKeys={["alpha", "bravo", "charlie"]}
      fieldLabelFn={i => `Character ${i}`}
    />
  </FormikStoryWrapper>
)

export const withSingleField = () => (
  <FormikStoryWrapper
    initialValues={{
      characters: {},
    }}
  >
    <TextInputGroup
      label="Enter names of Batman characters"
      groupName="characters"
      fieldKeys={["alpha"]}
      fieldLabelFn={i => `Character ${i}`}
    />
  </FormikStoryWrapper>
)

export const withDefaultValues = () => (
  <FormikStoryWrapper
    initialValues={{
      characters: {
        alpha: "Batman",
        bravo: "Robin",
      },
    }}
  >
    <TextInputGroup
      label="Enter names of Batman characters"
      groupName="characters"
      fieldKeys={["alpha", "bravo", "charlie"]}
      fieldLabelFn={i => `Character ${i}`}
    />
  </FormikStoryWrapper>
)

export const withValidation = () => {
  return (
    <FormikStoryWrapper
      initialValues={{
        characters: {},
      }}
      validate={() => ({ characters: "This field is invalid" })}
      validateOnMount
      initialTouched={{
        characters: true,
      }}
    >
      <TextInputGroup
        label="Enter names of Batman characters"
        groupName="characters"
        fieldKeys={["alpha", "bravo", "charlie"]}
        fieldLabelFn={i => `Character ${i}`}
      />
    </FormikStoryWrapper>
  )
}
