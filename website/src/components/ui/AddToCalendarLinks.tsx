import React from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { stringify } from "query-string"
import classnames from "classnames"

dayjs.extend(utc)

// Documentation for how to add dates from:
// https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs

interface Event {
  title: string
  description: string
  startTime: string | Date
  endTime: string | Date
  location: string
  url: string
  allDay?: boolean
}

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

function google(event: Event): string {
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

function outlook(event: Event): string {
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

function yahoo(event: Event): string {
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

function ical(event: Event): string {
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

type CalendarType = "google" | "yahoo" | "outlookcom" | "apple" | "ical"

function getLabel(type: CalendarType) {
  switch (type) {
    case "google":
      return "Google Calendar"
    case "yahoo":
      return "Yahoo"
    case "outlookcom":
      return "Outlook.com"
    case "apple":
      return "Apple iCal"
    case "ical":
      return "Download .ics"
  }
}

function getViewbox(icon: CalendarType) {
  switch (icon) {
    case "apple":
      return "0 0 384 512"
    case "yahoo":
      return "0 0 448 512"
    case "outlookcom":
      return "0 0 448 512"
    case "google":
      return "0 0 488 512"
    case "ical":
      return "0 0 448 512"
  }
}

function getIcon(icon: CalendarType) {
  switch (icon) {
    case "apple":
      return (
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
      )
    case "outlookcom":
      return (
        <path d="M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z"></path>
      )
    case "yahoo":
      return (
        <path d="M252 292l4 220c-12.7-2.2-23.5-3.9-32.3-3.9-8.4 0-19.2 1.7-32.3 3.9l4-220C140.4 197.2 85 95.2 21.4 0c11.9 3.1 23 3.9 33.2 3.9 9 0 20.4-.8 34.1-3.9 40.9 72.2 82.1 138.7 135 225.5C261 163.9 314.8 81.4 358.6 0c11.1 2.9 22 3.9 32.9 3.9 11.5 0 23.2-1 35-3.9C392.1 47.9 294.9 216.9 252 292z"></path>
      )
    case "google":
      return (
        <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
      )
    case "ical":
      return (
        <path d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"></path>
      )
  }
}

interface CalendarLinkProps {
  url: string
  type: CalendarType
  download?: string
}

function CalendarLink({ url, type, download }: CalendarLinkProps) {
  const extraProps = download
    ? { download: download }
    : { target: "_blank", rel: "noopener noreferrer" }
  return (
    <li>
      <a className="c-add-calendar-button" href={url} {...extraProps}>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={getViewbox(type)}
        >
          {getIcon(type)}
        </svg>
        {getLabel(type)}
      </a>
    </li>
  )
}

interface AddToCalendarProps {
  event: Event
  className?: string
}

const AddToCalendarLinks: React.FC<AddToCalendarProps> = ({
  event,
  className,
}) => {
  return (
    <ul className={classnames("flex flex-wrap justify-center", className)}>
      <CalendarLink url={ical(event)} download="event.ics" type="apple" />
      <CalendarLink url={google(event)} type="google" />
      <CalendarLink url={outlook(event)} type="outlookcom" />
      <CalendarLink url={yahoo(event)} type="yahoo" />
      <CalendarLink url={ical(event)} download="event.ics" type="ical" />
    </ul>
  )
}
export default AddToCalendarLinks
