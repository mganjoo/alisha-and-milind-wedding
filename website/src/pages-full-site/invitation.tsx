import { RouteComponentProps } from "@reach/router"
import React from "react"
import BaseLayout from "../components/layout/BaseLayout"
import SEO from "../components/meta/SEO"
import InvitationCard from "../components/partials/InvitationCard"

interface InvitationPageNavigationState {
  code?: string
  immediate?: boolean
  fromRsvp?: boolean
}

const InvitationPage: React.FC<RouteComponentProps> = ({ location }) => {
  const state: InvitationPageNavigationState =
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
          skipAnimation={state.immediate}
          initialCode={state.code}
          navLink={returnLink}
        />
      </main>
    </BaseLayout>
  )
}
export default InvitationPage
