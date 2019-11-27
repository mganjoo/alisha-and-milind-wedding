import React from "react"
import AddToCalendarLinks from "./AddToCalendarLinks"
import { date, withKnobs, boolean } from "@storybook/addon-knobs"

export default {
  title: "AddToCalendarLinks",
  decorators: [withKnobs],
}

function dateKnob(name: string, defaultValue: Date) {
  const timestamp = date(name, defaultValue)
  return new Date(timestamp)
}

export const main = () => (
  <AddToCalendarLinks
    label="Add to calendar"
    event={{
      title: "My Event",
      description: "This is an event",
      location: "San Francisco, CA",
      startTime: dateKnob("Start", new Date("2019-08-01T05:00")),
      endTime: dateKnob("End", new Date("2019-08-01T07:00")),
      allDay: boolean("All day", false),
      url: "https://example.com",
    }}
  />
)
