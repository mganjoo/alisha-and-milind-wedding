import React from "react"
import { storiesOf } from "@storybook/react"
import Button from "../src/components/ui/Button"

storiesOf("Button", module).add("default", () => (
  <div className="p-5">
    <Button>Click</Button>
  </div>
))
