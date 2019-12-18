import React from "react"
import SEO from "../components/meta/SEO"
import Authenticated from "../components/partials/Authenticated"
import { useStaticQuery, graphql } from "gatsby"
import ImageLayout from "../components/layout/ImageLayout"
import RsvpSection from "../components/partials/RsvpSection"
import { WeddingMetadataContext } from "../utils/WeddingMetadataContext"
import PageHeading from "../components/ui/PageHeading"

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
        <PageHeading>RSVP</PageHeading>
        <Authenticated refreshOlderThanSecs={90}>
          <div>
            <WeddingMetadataContext.Consumer>
              {value => (
                <div className="mb-4">
                  <p className="c-body-text">
                    We hope to see you at our wedding! Please RSVP by{" "}
                    <span className="font-semibold">{value.deadline}</span>.
                  </p>
                  <p className="c-body-text">
                    Any member of your party can submit for the whole group, and
                    you can edit your RSVP as many times as you like before{" "}
                    {value.shortDeadline}.
                  </p>
                </div>
              )}
            </WeddingMetadataContext.Consumer>
            <RsvpSection />
          </div>
        </Authenticated>
      </section>
    </ImageLayout>
  )
}

export default RsvpPage
