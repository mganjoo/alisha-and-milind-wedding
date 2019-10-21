import React from "react"
import { storiesOf } from "@storybook/react"
import { StoryFn } from "@storybook/addons"
import LabelWrapper from "../src/components/form/LabelWrapper"
import Input from "../src/components/form/Input"

const Constrained = (storyFn: StoryFn<React.ReactElement>) => (
  <div className="max-w-md p-4">{storyFn()}</div>
)

storiesOf("LabelWrapper", module)
  .addDecorator(Constrained)
  .add("default", () => (
    <LabelWrapper label="Name" errorMessage={null}>
      <Input type="text" />
    </LabelWrapper>
  ))
  .add("with error", () => (
    <LabelWrapper label="Name" errorMessage="Invalid input">
      <Input type="text" invalid={true} />
    </LabelWrapper>
  ))
