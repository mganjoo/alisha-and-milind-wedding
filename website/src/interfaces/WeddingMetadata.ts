import { graphql, useStaticQuery } from "gatsby"

export interface WeddingMetadata {
  shortDeadline?: string
  deadline?: string
  contactEmail?: string
  siteUrl?: string
  location?: string
}

export function useWeddingMetadata() {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          shortDeadline: rsvpDeadline(formatString: "MMMM D")
          deadline: rsvpDeadline(formatString: "MMMM D, YYYY")
          contactEmail
          siteUrl
          location
        }
      }
    }
  `)
  return site.siteMetadata as WeddingMetadata
}
