import React from "react"
import { RouteComponentProps } from "@reach/router"
import BaseLayout from "../components/layout/BaseLayout"
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
    ? { label: "RSVP", url: "/rsvp" }
    : undefined
  return (
    <BaseLayout>
      <main>
        <InvitationCard
          playing
          startDelayMs={2500}
          skipAnimation={state.immediate}
          initialCode={state.code}
          navLink={returnLink}
        />
      </main>
    </BaseLayout>
  )
}
export default InvitationPage
