import React from "react"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

interface SEOProps {
  title: string
  description: string
  lang: string
  image: string
}

function SEO({ title, description, lang, image }: SEOProps) {
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
  const metaImage = `${site.siteMetadata.siteUrl}${image ||
    site.siteMetadata.image}`

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={title}
      titleTemplate={`%s: ${site.siteMetadata.title}`}
      meta={[
        { name: `description`, content: metaDescription },
        { property: `og:title`, content: title },
        { property: `og:type`, content: `website` },
        { property: `og:image`, content: metaImage },
        { property: `og:description`, content: metaDescription },
        { name: `twitter:card`, content: `summary` },
        { name: `twitter:creator`, content: site.siteMetadata.author },
      ]}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
  description: ``,
  image: ``,
}

export default SEO
