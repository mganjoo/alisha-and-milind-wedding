import React from "react"
import { RouteComponentProps } from "@reach/router"
import BaseLayout from "../components/layout/BaseLayout"
import Authenticated from "../components/partials/Authenticated"
import FullPageInvitation from "../components/partials/FullPageInvitation"

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
          <FullPageInvitation startDelay={2500} />
        </main>
      </Authenticated>
    </BaseLayout>
  )
}
export default InvitationPage
