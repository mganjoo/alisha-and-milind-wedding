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
            ...HeroImage
          }
        }
      }
    `
  )
  return (
    <NavLayout
      heroImage={imageData.heroImage.childImageSharp.fluid}
      alt="Milind leading Alisha by the hand on the beach at sunset. Milind is in a black blazer and trousers, and Alisha is in a grey flowy dress"
      hideBackToTop
    >
      <SEO
        title="Home"
        image="/meta-main-hero.jpg"
        description="Welcome to our wedding website! Here you will find the most up-to-date information about the wedding weekend, including event schedule and travel details."
      />
      <div className="c-article c-narrow-body">
        <p>
          Welcome to our wedding website! This is where you will find the most
          up-to-date information about the wedding weekend, including event
          schedule and travel details.
        </p>
        <p>
          We are so excited to celebrate with you!
          <br />
          <br />
          Love,
          <br />
          Alisha &amp; Milind
        </p>
        <p>
          <strong>Update:</strong> For the latest information about the COVID-19
          coronavirus outbreak, please see our <Link to="/faq">FAQ</Link> page.
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
