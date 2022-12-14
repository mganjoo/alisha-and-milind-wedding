import { useStaticQuery, graphql } from "gatsby"
import React from "react"
import { Helmet } from "react-helmet"

interface SEOProps {
  title: string
  description?: string
  image?: string
}

const SEO: React.FC<SEOProps> = ({ title, description, image }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const metaImage = image ? `${site.siteMetadata.siteUrl}${image}` : ``

  return (
    <Helmet
      htmlAttributes={{ lang: "en" }}
      title={title}
      titleTemplate={`%s: ${site.siteMetadata.title}`}
      meta={[
        { name: `description`, content: metaDescription },
        { property: `og:title`, content: title },
        { property: `og:type`, content: `website` },
        { property: `og:image`, content: metaImage },
        { property: `og:description`, content: metaDescription },
        { property: `og:site_name`, content: site.siteMetadata.title },
        { name: `twitter:card`, content: `summary` },
        { name: `twitter:creator`, content: site.siteMetadata.author },
      ]}
    />
  )
}
export default SEO
