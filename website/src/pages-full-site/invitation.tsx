import React from "react"
import { RouteComponentProps } from "@reach/router"
import BaseLayout from "../components/layout/BaseLayout"
import InvitationCard from "../components/partials/InvitationCard"

interface InvitationPageNavigationState {
  code?: string
  immediate?: boolean
}

const InvitationPage: React.FC<RouteComponentProps> = ({ location }) => {
  const state: InvitationPageNavigationState =
    location && location.state ? location.state : {}
  return (
    <BaseLayout>
      <main>
        <InvitationCard
          playing
          startDelayMs={2500}
          skipAnimation={state.immediate}
          initialCode={state.code}
        />
      </main>
    </BaseLayout>
  )
}
export default InvitationPage
