import { graphql, useStaticQuery } from "gatsby"

export interface WeddingMetadata {
  shortRsvpDeadline?: string
  rsvpDeadline?: string
  bookingDeadline?: string
  contactEmail?: string
  siteUrl?: string
  location?: string
}

export function useWeddingMetadata() {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          shortRsvpDeadline: rsvpDeadline(formatString: "MMMM D")
          rsvpDeadline: rsvpDeadline(formatString: "MMMM D, YYYY")
          bookingDeadline: bookingDeadline(formatString: "MMMM D, YYYY")
          contactEmail
          siteUrl
          location
        }
      }
    }
  `)
  return site.siteMetadata as WeddingMetadata
}
