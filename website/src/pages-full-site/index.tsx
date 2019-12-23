import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import SEO from "../components/meta/SEO"
import ImageLayout from "../components/layout/ImageLayout"

const IndexPage = () => {
  const imageData = useStaticQuery(
    graphql`
      query {
        heroImage: file(relativePath: { eq: "main-hero.jpg" }) {
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
    <ImageLayout
      fluidImage={imageData.heroImage.childImageSharp.fluid}
      alt="Alisha and Milind posing in front of the sunset in Monterey, California"
      objectPosition="50% 32%"
    >
      <SEO title="Home" />
      <div className="c-article max-w-xl mx-auto">
        <p>
          Welcome to our wedding website! We are so excited to celebrate this
          weekend with you!
          <br />
          <br />
          Love,
          <br />
          Alisha &amp; Milind
        </p>
        <div className="mt-8">
          <Link
            to="/rsvp"
            className="c-button c-button-primary c-button-comfortable"
          >
            RSVP
          </Link>
        </div>
      </div>
    </ImageLayout>
  )
}
export default IndexPage
