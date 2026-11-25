import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

/** Site configuration (was `siteMetadata` in gatsby-config.js). */
const raw = {
  title: "Alisha & Milind Wedding",
  description: "Welcome to our wedding website! We're excited to celebrate with you.",
  author: "@mganjoo",
  siteUrl: "https://alishaandmilind.wedding",
  contactEmail: "alisha.and.milind@gmail.com",
  displayTitle: "Alisha & Milind",
  weddingDate: "2022-05-28",
  bookingDeadline: "2022-04-28",
  rsvpDeadline: "2022-05-10",
  rsvpChangeDeadline: "2022-05-21",
  location: "Las Vegas, NV",
  hashtag: "#AlishaWonAMilAgain",
  mainVenue: ["JW Marriott Las Vegas Resort & Spa", "221 N Rampart Blvd", "Las Vegas, NV 89145"],
  mainVenueUrl: "https://goo.gl/maps/JYLyQWqnpuAWtK7x6",
  preEventsVenue: ["123 Example Ave", "Las Vegas, NV 89145"],
  preEventsVenueUrl: "https://goo.gl/maps/JYLyQWqnpuAWtK7x6",
} as const

// Dates are calendar days; format in UTC so the build machine's timezone
// can never shift them.
const short = (d: string) => dayjs.utc(d).format("MMMM D, YYYY")
const long = (d: string) => dayjs.utc(d).format("dddd, MMMM D, YYYY")

export interface WeddingMetadata {
  rsvpDeadline: string
  rsvpDeadlineLong: string
  rsvpChangeDeadline: string
  rsvpChangeDeadlineLong: string
  bookingDeadline: string
  bookingDeadlineLong: string
  displayTitle: string
  weddingDate: string
  contactEmail: string
  hashtag: string
  siteUrl: string
  location: string
  mainVenue: readonly string[]
  mainVenueUrl: string
  preEventsVenue: readonly string[]
  preEventsVenueUrl: string
}

/** Formatted metadata, same shape the Gatsby `useWeddingMetadata` hook returned. */
export const metadata: WeddingMetadata = {
  rsvpDeadline: short(raw.rsvpDeadline),
  rsvpDeadlineLong: long(raw.rsvpDeadline),
  rsvpChangeDeadline: short(raw.rsvpChangeDeadline),
  rsvpChangeDeadlineLong: long(raw.rsvpChangeDeadline),
  bookingDeadline: short(raw.bookingDeadline),
  bookingDeadlineLong: long(raw.bookingDeadline),
  displayTitle: raw.displayTitle,
  weddingDate: short(raw.weddingDate),
  contactEmail: raw.contactEmail,
  hashtag: raw.hashtag,
  siteUrl: raw.siteUrl,
  location: raw.location,
  mainVenue: raw.mainVenue,
  mainVenueUrl: raw.mainVenueUrl,
  preEventsVenue: raw.preEventsVenue,
  preEventsVenueUrl: raw.preEventsVenueUrl,
}

export const site = {
  title: raw.title,
  description: raw.description,
  author: raw.author,
  siteUrl: raw.siteUrl,
}
