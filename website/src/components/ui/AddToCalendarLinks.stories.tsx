import React from "react"
import AddToCalendarLinks from "./AddToCalendarLinks"
import { date, withKnobs, boolean } from "@storybook/addon-knobs"
import StoryPaddingWrapper from "../../utils/StoryPaddingWrapper"

export default {
  title: "AddToCalendarLinks",
  decorators: [
    withKnobs,
    (storyFn: any) => <StoryPaddingWrapper>{storyFn()}</StoryPaddingWrapper>,
  ],
}

function dateKnob(name: string, defaultValue: Date) {
  const timestamp = date(name, defaultValue)
  return new Date(timestamp)
}

const makeEvent = () => ({
  title: "My Event",
  description: "This is an event",
  location: "San Francisco, CA",
  startTime: dateKnob("Start", new Date("2019-08-01T05:00")),
  endTime: dateKnob("End", new Date("2019-08-01T07:00")),
  allDay: boolean("All day", false),
  url: "https://example.com",
})

export const main = () => (
  <AddToCalendarLinks label="Add to calendar" event={makeEvent()} />
)

export const withDropdown = () => (
  <AddToCalendarLinks label="Add to calendar" event={makeEvent()} dropdown />
)
