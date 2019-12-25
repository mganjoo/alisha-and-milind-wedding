import { useStaticQuery, graphql, Link } from "gatsby"
import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import Authenticated from "../components/partials/Authenticated"
import ReeditableRsvpForm from "../components/partials/rsvp/ReeditableRsvpForm"
import PageHeading from "../components/ui/PageHeading"
import { WeddingMetadataContext } from "../utils/WeddingMetadataContext"

const RsvpPage = () => {
  const imageData = useStaticQuery(
    graphql`
      query {
        heroImage: file(relativePath: { eq: "rsvp-hero.jpg" }) {
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
      heroBackground="#D7CDC0"
      alt="Picture of Alisha and Milind laughing at the camera"
    >
      <SEO title="RSVP" image="/meta-rsvp-hero.jpg" />
      <PageHeading>RSVP</PageHeading>
      <Authenticated refreshOlderThanSecs={90}>
        <div className="c-narrow-body">
          <WeddingMetadataContext.Consumer>
            {value => (
              <>
                <div className="c-article">
                  <p>
                    We hope to see you at our wedding! Please RSVP by{" "}
                    <strong>{value.deadline}</strong>.
                  </p>
                  <p>
                    Any member of your party can submit for the whole group, and
                    you can edit your RSVP as many times as you like before{" "}
                    {value.shortDeadline}.
                  </p>
                  <div className="flex justify-center my-6">
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
    </NavLayout>
  )
}

export default RsvpPage
