import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import React from "react"
import SEO from "../components/meta/SEO"
import BaseLayout from "../components/layout/BaseLayout"
import { Link } from "gatsby"

const NotFoundPage = () => {
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
      <SEO title="404 Not Found" />
      <main className="p-6 max-w-md c-article">
        <h1>Oops!</h1>
        <p>
          We couldn&apos;t find that page. The full website is still a work in
          progress, so stay tuned!
        </p>
        <p>
          Meanwhile, please <Link to="/save-the-date">save the date</Link> for
          the big weekend!
        </p>
        <Img
          className="mt-6 w-5/6"
          fluid={imageData.image.childImageSharp.fluid}
          alt=""
        />
      </main>
    </BaseLayout>
  )
}
export default NotFoundPage
