import { Link } from "gatsby"
import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import Authenticated from "../components/partials/Authenticated"
import ContactEmail from "../components/partials/ContactEmail"
import ReeditableRsvpForm from "../components/partials/rsvp/ReeditableRsvpForm"
import PageHeading from "../components/ui/PageHeading"
import { InvitationNavigationState } from "../interfaces/InvitationNavigationState"
import { WeddingMetadataContext } from "../utils/WeddingMetadataContext"

const RsvpPage = () => (
  <NavLayout>
    <SEO
      title="RSVP"
      description="We hope to see you at our wedding! Please RSVP on this page."
    />
    <PageHeading>RSVP</PageHeading>
    <Authenticated>
      <div className="c-narrow-body">
        <WeddingMetadataContext.Consumer>
          {value => (
            <>
              <div className="c-article">
                <p>
                  We hope to see you at our wedding! Please RSVP by{" "}
                  <strong>{value.rsvpDeadline}</strong>.
                </p>
                <p>
                  Any member of your party can submit for the whole group, and
                  you can edit your RSVP as many times as you like before{" "}
                  {value.shortRsvpDeadline}. If you need to make changes after
                  that, just send us an email at <ContactEmail />.
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
            </>
          )}
        </WeddingMetadataContext.Consumer>
        <ReeditableRsvpForm />
      </div>
    </Authenticated>
  </NavLayout>
)

export default RsvpPage
