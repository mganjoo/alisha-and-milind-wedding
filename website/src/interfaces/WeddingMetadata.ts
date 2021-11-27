import { graphql, useStaticQuery } from "gatsby"

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
  siteUrl: string
  location: string
  mainVenue: string[]
  mainVenueUrl: string
  preEventsVenue: string[]
  preEventsVenueUrl: string
}

export function useWeddingMetadata() {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          rsvpDeadline: rsvpDeadline(formatString: "MMMM D, YYYY")
          rsvpDeadlineLong: rsvpDeadline(formatString: "dddd, MMMM D, YYYY")
          rsvpChangeDeadline: rsvpChangeDeadline(formatString: "MMMM D, YYYY")
          rsvpChangeDeadlineLong: rsvpChangeDeadline(
            formatString: "dddd, MMMM D, YYYY"
          )
          bookingDeadline: bookingDeadline(formatString: "MMMM D, YYYY")
          bookingDeadlineLong: bookingDeadline(
            formatString: "dddd, MMMM D, YYYY"
          )
          displayTitle
          weddingDate: weddingDate(formatString: "MMMM D, YYYY")
          mainVenue
          mainVenueUrl
          preEventsVenue
          preEventsVenueUrl
          contactEmail
          siteUrl
          location
        }
      }
    }
  `)
  return site.siteMetadata as WeddingMetadata
}
