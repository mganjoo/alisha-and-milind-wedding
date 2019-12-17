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
// Force Google to parse date as UTC by suffixing 'Z'
const utcFormat = "YYYYMMDD[T]HHmmss[Z]"
// Outlook always expects UTC date, so no suffix
const utcFormatOutlook = "YYYYMMDD[T]HHmmss"

function formatTime(date: string | Date, format: string) {
  return dayjs(date)
    .utc()
    .format(format)
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
  const details = {
    rru: "addevent",
    path: "/calendar/action/compose",
    startdt: formatTime(event.startTime, utcFormatOutlook),
    enddt: formatTime(event.endTime, utcFormatOutlook),
    subject: event.title,
    location: event.location,
    body: event.description,
    allday: (typeof event.allDay === "undefined"
      ? false
      : event.allDay
    ).toString(),
  }
  return `https://outlook.live.com/owa/?${stringify(details)}`
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
    "DESCRIPTION:" + event.description,
    "LOCATION:" + event.location,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n")
  return encodeURI("data:text/calendar;charset=utf8," + content)
}
