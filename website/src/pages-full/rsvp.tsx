import { useStaticQuery, graphql, Link } from "gatsby"
import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import Authenticated from "../components/partials/Authenticated"
import ReeditableRsvpForm from "../components/partials/rsvp/ReeditableRsvpForm"
import Alert from "../components/ui/Alert"
import PageHeading from "../components/ui/PageHeading"
import { InvitationNavigationState } from "../interfaces/InvitationNavigationState"
import { WeddingMetadataContext } from "../utils/WeddingMetadataContext"

const RsvpPage = () => {
  const data = useStaticQuery(
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
      heroImage={data.heroImage.childImageSharp.gatsbyImageData}
      alt="Picture of Milind and Alisha holding hands, with their backs to the camera, running on the beach at sunset. Milind is in a black blazer and trousers, and Alisha is in a grey dress."
    >
      <SEO
        title="RSVP"
        image="/meta-rsvp-hero.jpg"
        description="We hope to see you at our wedding! Please RSVP on this page."
      />
      <PageHeading>RSVP</PageHeading>
      <div className="c-narrow-body">
        <Authenticated>
          <WeddingMetadataContext.Consumer>
            {(value) => (
              <div className="c-narrow-body">
                <div className="c-article">
                  <p>
                    We hope to see you at the wedding! You can view the{" "}
                    <Link to="/schedule">Schedule</Link> and{" "}
                    <Link to="/faq">FAQ</Link> page for more details, and RSVP
                    using the form below.
                  </p>
                  <p>
                    We would appreciate your RSVP by{" "}
                    <strong>{value?.rsvpDeadline}</strong>.
                  </p>
                  <p>
                    We understand that everyone may have different comfort
                    levels around traveling or attending large gatherings during
                    this pandemic. We fully respect your decision to RSVP
                    accordingly.
                  </p>
                  <Alert isInfo>
                    We ask our guests to please RSVP{" "}
                    <strong>
                      only if they are or will be fully vaccinated by the start
                      of the event.
                    </strong>{" "}
                    For those who are unable to receive the vaccine, we kindly
                    request a negative COVID test within a 48-hour period of
                    attending any wedding event.
                  </Alert>
                  <div className="flex justify-center my-6">
                    <Link
                      to="/invitation"
                      state={{ fromRsvp: true } as InvitationNavigationState}
                      className="c-button c-button-secondary c-button-compact shadow-md"
                    >
                      View your invitation
                    </Link>
                  </div>
                </div>
                <ReeditableRsvpForm />
              </div>
            )}
          </WeddingMetadataContext.Consumer>
        </Authenticated>
      </div>
    </NavLayout>
  )
}

export default RsvpPage
