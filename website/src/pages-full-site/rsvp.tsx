import React, { useState } from "react"
import SEO from "../components/meta/SEO"
import Authenticated from "../components/partials/Authenticated"
import RsvpForm from "../components/partials/RsvpForm"
import { useStaticQuery, graphql } from "gatsby"
import ImageLayout from "../components/layout/ImageLayout"
import Check from "../components/partials/Check"

const RsvpPage = () => {
  const imageData = useStaticQuery(
    graphql`
      query {
        heroImage: file(relativePath: { eq: "rsvp-hero.jpg" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `
  )
  const [submitted, setSubmitted] = useState(false)
  return (
    <ImageLayout fluidImage={imageData.heroImage.childImageSharp.fluid}>
      <SEO title="RSVP" />
      <h1>RSVP</h1>
      <Authenticated>
        {!submitted ? (
          <>
            <p className="text-center">
              We hope to see you at our wedding! Please RSVP by March 15, 2019.
            </p>
            <RsvpForm onSubmit={() => setSubmitted(true)} />
          </>
        ) : (
          <div>
            <Check />
          </div>
        )}
      </Authenticated>
    </ImageLayout>
  )
}
export default RsvpPage
