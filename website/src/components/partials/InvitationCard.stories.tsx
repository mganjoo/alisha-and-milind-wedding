import React from "react"
import InvitationCard from "./InvitationCard"
import { boolean, withKnobs, number } from "@storybook/addon-knobs"

export default {
  title: "InvitationCard",
  decorators: [withKnobs],
}

export const main = () => (
  <InvitationCard
    playing={boolean("Playing", false)}
    reverse={boolean("Reverse", false)}
    startDelayMs={number("Delay in ms", 0)}
    testMode
  />
)
