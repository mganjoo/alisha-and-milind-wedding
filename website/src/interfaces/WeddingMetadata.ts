import { graphql, useStaticQuery } from "gatsby"

export interface WeddingMetadata {
  shortRsvpDeadline?: string
  rsvpDeadline?: string
  bookingDeadline?: string
  displayDates?: string
  contactEmail?: string
  siteUrl?: string
  location?: string
  mainVenue?: string[]
  mainVenueUrl?: string
}

export function useWeddingMetadata() {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          shortRsvpDeadline: rsvpDeadline(formatString: "MMMM D")
          rsvpDeadline: rsvpDeadline(formatString: "MMMM D, YYYY")
          bookingDeadline: bookingDeadline(formatString: "MMMM D, YYYY")
          displayDates
          mainVenue
          mainVenueUrl
          contactEmail
          siteUrl
          location
        }
      }
    }
  `)
  return site.siteMetadata as WeddingMetadata
}
