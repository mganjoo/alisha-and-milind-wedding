import { RouteComponentProps } from "@reach/router"
import React from "react"
import BaseLayout from "../components/layout/BaseLayout"
import SEO from "../components/meta/SEO"
import InvitationCard from "../components/partials/InvitationCard"
import { isInvitationNavigationState } from "../interfaces/InvitationNavigationState"

const InvitationPage: React.FC<RouteComponentProps> = ({ location }) => {
  const arrivedFromRsvp =
    location && isInvitationNavigationState(location.state)
      ? location.state.fromRsvp
      : false
  const returnLink = arrivedFromRsvp
    ? { label: "Back to website", url: "/rsvp" }
    : undefined
  return (
    <BaseLayout>
      <SEO title="Welcome" image="/meta-main-hero.jpg" />
      <main>
        <InvitationCard
          playing
          startDelayMs={2000}
          skipAnimation={arrivedFromRsvp}
          navLink={returnLink}
        />
      </main>
    </BaseLayout>
  )
}
export default InvitationPage
