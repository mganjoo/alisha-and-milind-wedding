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
      heroImage={imageData.heroImage.childImageSharp.gatsbyImageData}
      alt="Milind leading Alisha by the hand on the beach at sunset. Milind is in a black blazer and trousers, and Alisha is in a grey flowy dress."
    >
      <SEO
        title="Home"
        image="/meta-main-hero.jpg"
        description="Welcome to our wedding website! Here you will find the most up-to-date information about the wedding weekend, including event schedule and travel details."
      />
      <div className="c-narrow-body">
        <div className="c-article">
          <p>
            After a year and a half of life on Zoom, we are so excited to
            finally be able to celebrate with you in person&hellip; but this
            time in Las Vegas!
          </p>
          <p>
            This website is where you will find the most up-to-date information
            about the wedding, including the event schedule and travel details.
          </p>
          <p>
            We can&rsquo;t wait to see you soon in Vegas!
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
            className="c-button c-button-primary c-button-comfortable inline-block"
          >
            RSVP
          </Link>
        </div>
      </div>
    </NavLayout>
  )
}
export default IndexPage
