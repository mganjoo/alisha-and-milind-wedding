import React from "react"
import { storiesOf } from "@storybook/react"
import AddToCalendarLinks from "../src/components/ui/AddToCalendarLinks"

storiesOf("AddToCalendarLinks", module).add("default", () => (
  <AddToCalendarLinks
    label="Add to calendar"
    event={{
      title: "My Event",
      description: "This is an event",
      location: "San Francisco, CA",
      startTime: new Date("2019-08-01T05:00"),
      endTime: new Date("2019-08-01T07:00"),
      url: "https://example.com",
    }}
  />
))
