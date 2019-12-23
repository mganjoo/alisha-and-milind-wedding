import React from "react"
import SEO from "../components/meta/SEO"
import Authenticated from "../components/partials/Authenticated"
import { useStaticQuery, graphql, Link } from "gatsby"
import ImageLayout from "../components/layout/ImageLayout"
import ReeditableRsvpForm from "../components/partials/rsvp/ReeditableRsvpForm"
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
    <ImageLayout
      fluidImage={imageData.heroImage.childImageSharp.fluid}
      alt="Picture of Alisha and Milind laughing at the camera"
    >
      <SEO title="RSVP" />
      <PageHeading>RSVP</PageHeading>
      <Authenticated refreshOlderThanSecs={90}>
        <div className="max-w-xl mx-auto">
          <WeddingMetadataContext.Consumer>
            {value => (
              <>
                <div className="c-article mb-8">
                  <p>
                    We hope to see you at our wedding! Please RSVP by{" "}
                    <strong>{value.deadline}</strong>.
                  </p>
                  <p>
                    Any member of your party can submit for the whole group, and
                    you can edit your RSVP as many times as you like before{" "}
                    {value.shortDeadline}.
                  </p>
                  <div className="flex justify-center py-2">
                    <Link
                      to="/invitation"
                      state={{ fromRsvp: true }}
                      className="c-button c-button-secondary c-button-compact shadow-md"
                    >
                      View your invitation
                    </Link>
                  </div>
                </div>
              </>
            )}
          </WeddingMetadataContext.Consumer>
          <ReeditableRsvpForm />
        </div>
      </Authenticated>
    </ImageLayout>
  )
}

export default RsvpPage
