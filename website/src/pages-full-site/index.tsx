import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import SEO from "../components/meta/SEO"
import ImageLayout from "../components/layout/ImageLayout"

const IndexPage = () => {
  const imageData = useStaticQuery(
    graphql`
      query {
        heroImage: file(relativePath: { eq: "wedding-hero.jpg" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `
  )
  return (
    <ImageLayout fluidImage={imageData.heroImage.childImageSharp.fluid}>
      <>
        <SEO title="Home" />
        <div className="c-article">
          <p>
            Welcome to our wedding website! We are so excited to celebrate this
            weekend with you!
            <br />
            <br />
            Love,
            <br />
            Alisha &amp; Milind
          </p>
          <p className="mt-6">
            <Link to="/rsvp">RSVP</Link>
          </p>
        </div>
      </>
    </ImageLayout>
  )
}
export default IndexPage
