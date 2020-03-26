import { RouteComponentProps } from "@reach/router"
import { useStaticQuery, graphql, Link } from "gatsby"
import Img from "gatsby-image"
import React from "react"
import BaseLayout from "../layout/BaseLayout"
import SEO from "../meta/SEO"

const NotFound: React.FC<RouteComponentProps> = () => {
  const imageData = useStaticQuery(
    graphql`
      query {
        image: file(relativePath: { eq: "where-am-i.jpg" }) {
          childImageSharp {
            fluid(maxWidth: 576) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `
  )
  return (
    <BaseLayout>
      <SEO title="Not Found" />
      <main className="flex p-3 mx-auto justify-center items-center max-w-lg min-h-screen">
        <div className="c-shadow-box">
          <h1 className="text-3xl font-sans mb-2">Oops!</h1>
          <div className="c-body-text-container">
            <p>
              We couldn&rsquo;t find that page. No worries: we can continue our
              celebrations on the <Link to="/">homepage</Link>!
            </p>
          </div>
          <Img
            className="w-full"
            fluid={imageData.image.childImageSharp.fluid}
            alt="Milind looking away in the distance, confused."
          />
        </div>
      </main>
    </BaseLayout>
  )
}
export default NotFound
