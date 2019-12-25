import { graphql, useStaticQuery, Link } from "gatsby"
import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"

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
    <NavLayout
      heroImage={imageData.heroImage.childImageSharp.fluid}
      heroBackground="#D6D6D6"
      alt="Alisha and Milind posing in front of the sunset in Monterey, California"
      objectPosition="50% 32%"
    >
      <SEO title="Home" />
      <div className="c-article c-narrow-body">
        <p>
          Welcome to our wedding website! We are so excited to celebrate this
          weekend with you!
          <br />
          <br />
          Love,
          <br />
          Alisha &amp; Milind
        </p>
      </div>
      <div className="c-narrow-body">
        <Link
          to="/rsvp"
          className="c-button c-button-primary c-button-comfortable"
        >
          RSVP
        </Link>
      </div>
    </NavLayout>
  )
}
export default IndexPage
