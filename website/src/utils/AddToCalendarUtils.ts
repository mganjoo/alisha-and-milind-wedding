import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { stringify } from "query-string"

export interface CalendarEvent {
  title: string
  description: string
  startTime: string | Date
  endTime: string | Date
  location?: string
  url?: string
  allDay?: boolean
  shortName?: string
}

// Documentation for how to add dates from:
// https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs

dayjs.extend(utc)

const allDayFormat = "YYYYMMDD"
const allDayFormatOutlook = "YYYY-MM-DD"
const utcFormat = "YYYYMMDD[T]HHmmss[Z]"
const utcFormatOutlook = "YYYY-MM-DD[T]HH:mm:ss[Z]"

function formatTime(date: string | Date, format: string) {
  return dayjs(date).utc().format(format)
}

export function google(event: CalendarEvent): string {
  const format = event.allDay ? allDayFormat : utcFormat
  const start = formatTime(event.startTime, format)
  const end = formatTime(event.endTime, format)
  const details = {
    action: "TEMPLATE",
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${start}/${end}`,
  }
  return `https://calendar.google.com/calendar/render?${stringify(details)}`
}

export function outlook(event: CalendarEvent): string {
  const format = event.allDay ? allDayFormatOutlook : utcFormatOutlook
  const details = {
    rru: "addevent",
    path: "/calendar/action/compose",
    startdt: formatTime(event.startTime, format),
    enddt: formatTime(event.endTime, format),
    subject: event.title,
    location: event.location,
    body: event.description,
    allday: (typeof event.allDay === "undefined"
      ? false
      : event.allDay
    ).toString(),
  }
  return `https://outlook.live.com/calendar/0/deeplink/compose?${stringify(
    details
  )}`
}

export function yahoo(event: CalendarEvent): string {
  const format = event.allDay ? allDayFormat : utcFormat
  const details = {
    v: 60,
    title: event.title,
    st: formatTime(event.startTime, format),
    et: formatTime(event.endTime, format),
    desc: event.description,
    in_loc: event.location,
    dur: event.allDay ? "allday" : undefined,
  }
  return `https://calendar.yahoo.com/?${stringify(details)}`
}

export function ical(event: CalendarEvent): string {
  const format = event.allDay ? allDayFormat : utcFormat
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "URL:" + event.url,
    "DTSTART:" + formatTime(event.startTime, format),
    "DTEND:" + formatTime(event.endTime, format),
    "SUMMARY:" + event.title,
    "DESCRIPTION:" + event.description.replace(/\n/g, "\\n"),
    "LOCATION:" + event.location,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n")
  return encodeURI("data:text/calendar;charset=utf8," + content)
}
