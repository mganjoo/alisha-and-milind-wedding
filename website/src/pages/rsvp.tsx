import { useStaticQuery, graphql, Link } from "gatsby"
import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import Authenticated from "../components/partials/Authenticated"
import ReeditableRsvpForm from "../components/partials/rsvp/ReeditableRsvpForm"
import PageHeading from "../components/ui/PageHeading"
import { InvitationNavigationState } from "../interfaces/InvitationNavigationState"

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
      heroImage={data.heroImage.childImageSharp.fluid}
      alt="Picture of Milind and Alisha holding hands, with their backs to the camera, running on the beach at sunset. Milind is in a black blazer and trousers, and Alisha is in a grey dress"
    >
      <SEO
        title="RSVP"
        image="/meta-rsvp-hero.jpg"
        description="We hope to see you at our wedding! Please RSVP on this page."
      />
      <PageHeading>RSVP</PageHeading>
      <Authenticated>
        <div className="c-narrow-body">
          <div className="c-article">
            <p>
              We hope to see you at our wedding! Please RSVP using the form
              below. View the <Link to="/schedule">Schedule</Link> page for more
              details about the wedding events.
            </p>
            <p>
              Any member of your party can submit for the whole group. If
              needed, you can edit your RSVP after you&rsquo;ve submitted.
            </p>
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
      </Authenticated>
    </NavLayout>
  )
}

export default RsvpPage
