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

export const main = () => {
  const purpose = optionsKnob(
    "Purpose",
    { Primary: "primary", Secondary: "secondary", Tertiary: "tertiary" },
    "primary",
    { display: "inline-radio" }
  )
  const fit = optionsKnob(
    "Fit",
    { Comfortable: "comfortable", Compact: "compact" },
    "comfortable",
    { display: "inline-radio" }
  )
  return (
    <Button
      onClick={handleClick}
      purpose={purpose}
      fit={fit}
      disabled={boolean("Disabled", false)}
    >
      {text("Label", "Click")}
    </Button>
  )
}
