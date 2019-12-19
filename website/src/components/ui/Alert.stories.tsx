import React from "react"
import Alert from "./Alert"
import { action } from "@storybook/addon-actions"
import StoryPaddingWrapper from "../../utils/StoryPaddingWrapper"

export default {
  title: "Alert",
}

export const main = () => (
  <StoryPaddingWrapper>
    <div className="flex flex-col items-center">
      <Alert>
        This is an alert. Includes an{" "}
        <button onClick={action("Clicked")}>anchor link</button>.
      </Alert>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
        assumenda totam officia dolorem voluptatibus culpa ex id ad delectus. In
        voluptatem eaque consequuntur atque explicabo? Praesentium a non maxime
        vitae.
      </p>
    </div>
  </StoryPaddingWrapper>
)