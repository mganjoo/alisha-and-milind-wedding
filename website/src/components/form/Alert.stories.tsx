import React from "react"
import Alert from "./Alert"
import { action } from "@storybook/addon-actions"

export default {
  title: "Alert",
}

export const main = () => (
  <div className="p-4 flex flex-col items-center">
    <Alert className="mb-4">
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
)
