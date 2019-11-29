import React from "react"
import InvitationCard from "./InvitationCard"
import { boolean, withKnobs } from "@storybook/addon-knobs"

export default {
  title: "InvitationCard",
  decorators: [withKnobs],
}

export const main = () => (
  <InvitationCard
    playing={boolean("Playing", false)}
    reverse={boolean("Reverse", false)}
  />
)
