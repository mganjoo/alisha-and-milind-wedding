import { RouteComponentProps } from "@reach/router"
import React from "react"
import BaseLayout from "../components/layout/BaseLayout"
import SEO from "../components/meta/SEO"
import InvitationCard from "../components/partials/InvitationCard"
import { InvitationNavigationState } from "../interfaces/InvitationNavigationState"

const InvitationPage: React.FC<RouteComponentProps> = ({ location }) => {
  const state: InvitationNavigationState =
    location && location.state ? location.state : {}
  const returnLink = state.fromRsvp
    ? { label: "Back to website", url: "/rsvp" }
    : undefined
  return (
    <BaseLayout>
      <SEO title="Welcome" image="/meta-main-hero.jpg" />
      <main>
        <InvitationCard
          playing
          startDelayMs={2000}
          skipAnimation={!state.animate}
          navLink={returnLink}
        />
      </main>
    </BaseLayout>
  )
}
export default InvitationPage
