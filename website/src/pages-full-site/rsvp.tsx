import React from "react"
import SEO from "../components/meta/SEO"
import Authenticated from "../components/partials/Authenticated"
import { useStaticQuery, graphql } from "gatsby"
import ImageLayout from "../components/layout/ImageLayout"
import RsvpStatus from "../components/partials/RsvpStatus"

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
  return (
    <ImageLayout fluidImage={imageData.heroImage.childImageSharp.fluid}>
      <SEO title="RSVP" />
      <section className="max-w-lg mx-auto">
        <h1 className="c-page-heading text-center">RSVP</h1>
        <Authenticated>
          <RsvpStatus />
        </Authenticated>
      </section>
    </ImageLayout>
  )
}
export default RsvpPage
