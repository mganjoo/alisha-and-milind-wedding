import React from "react"
import { useStaticQuery, graphql } from "gatsby"

export default function ContactEmail() {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          contactEmail
        }
      }
    }
  `)
  return (
    <a href={`mailto:${data.site.siteMetadata.contactEmail}`}>
      {data.site.siteMetadata.contactEmail}
    </a>
  )
}
