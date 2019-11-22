import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const ContactEmail: React.FC = () => {
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
export default ContactEmail
