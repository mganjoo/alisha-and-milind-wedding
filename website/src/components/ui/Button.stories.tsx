import React from "react"
import Button from "./Button"
import { action } from "@storybook/addon-actions"
import { withKnobs, text, boolean, optionsKnob } from "@storybook/addon-knobs"

export default {
  title: "Button",
  decorators: [
    (storyFn: any) => <div className="p-5">{storyFn()}</div>,
    withKnobs,
  ],
}

const handleClick = action("Clicked")
const fitKnob = () =>
  optionsKnob(
    "Fit",
    { Comfortable: "comfortable", Compact: "compact" },
    "comfortable",
    { display: "inline-radio" }
  )
const disabledKnob = () => boolean("Disabled", false)
const labelKnob = () => text("Label", "Click me")

export const primary = () => {
  return (
    <Button
      onClick={handleClick}
      purpose="primary"
      fit={fitKnob()}
      disabled={disabledKnob()}
    >
      {labelKnob()}
    </Button>
  )
}

export const secondary = () => {
  return (
    <Button
      onClick={handleClick}
      purpose="secondary"
      fit={fitKnob()}
      disabled={disabledKnob()}
    >
      {labelKnob()}
    </Button>
  )
}
export const tertiary = () => (
  <Button
    onClick={handleClick}
    purpose="tertiary"
    fit={fitKnob()}
    disabled={disabledKnob()}
  >
    {labelKnob()}
  </Button>
)
