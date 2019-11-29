import React from "react"
import { RouteComponentProps } from "@reach/router"
import BaseLayout from "../components/layout/BaseLayout"
import Authenticated from "../components/partials/Authenticated"
import AutoPlayingInvitationCard from "../components/partials/AutoPlayingInvitationCard"

interface InvitationPageNavigationState {
  code?: string
}

const InvitationPage: React.FC<RouteComponentProps> = ({ location }) => {
  const state: InvitationPageNavigationState =
    location && location.state ? location.state : {}
  return (
    <BaseLayout>
      <Authenticated initialCode={state.code}>
        <main>
          <AutoPlayingInvitationCard startDelayMs={2500} />
        </main>
      </Authenticated>
    </BaseLayout>
  )
}
export default InvitationPage
