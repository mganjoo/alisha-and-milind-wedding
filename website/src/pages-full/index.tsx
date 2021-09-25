import { graphql, useStaticQuery, Link } from "gatsby"
import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import Alert from "../components/ui/Alert"
import { WeddingMetadataContext } from "../utils/WeddingMetadataContext"

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
    >
      <SEO
        title="Home"
        image="/meta-main-hero.jpg"
        description="Welcome to our wedding website! Here you will find the most up-to-date information about the wedding weekend, including event schedule and travel details."
      />
      <div className="c-narrow-body">
        <WeddingMetadataContext.Consumer>
          {(value) => (
            <Alert isInfo>
              Due to the current COVID-19 outbreak, we have changed the wedding
              dates to {value.displayDates}. You can find the latest information
              on our <Link to="/faq">FAQ</Link> page.
            </Alert>
          )}
        </WeddingMetadataContext.Consumer>
        <div className="c-article">
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
        </div>
        <div>
          <Link
            to="/rsvp"
            className="c-button c-button-primary c-button-comfortable"
          >
            RSVP
          </Link>
        </div>
      </div>
    </NavLayout>
  )
}
export default IndexPage
