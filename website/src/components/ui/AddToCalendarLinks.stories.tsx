import React from "react"
import AddToCalendarLinks from "./AddToCalendarLinks"

export default {
  title: "AddToCalendarLinks",
}

export const main = () => (
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
)
