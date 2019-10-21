import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import React from "react"
import SEO from "../meta/SEO"
import BaseLayout from "../layout/BaseLayout"

const NotFound: React.FC = ({ children }) => {
  const imageData = useStaticQuery(
    graphql`
      query {
        image: file(relativePath: { eq: "where-am-i.jpg" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
      }
    `
  )
  return (
    <BaseLayout>
      <SEO title="Not Found" />
      <main className="p-6 max-w-md c-article">
        <h1>Oops!</h1>
        {children}
        <Img
          className="mt-6 w-5/6"
          fluid={imageData.image.childImageSharp.fluid}
          alt=""
        />
      </main>
    </BaseLayout>
  )
}
export default NotFound
