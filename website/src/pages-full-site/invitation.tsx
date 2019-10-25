import React from "react"
import { RouteComponentProps } from "@reach/router"
import InvitationCard from "../components/partials/InvitationCard"
import BaseLayout from "../components/layout/BaseLayout"
import Authenticated from "../components/partials/Authenticated"

interface InvitationPageNavigationState {
  code?: string
}

const InvitationPage: React.FC<RouteComponentProps> = ({ location }) => {
  const state: InvitationPageNavigationState =
    location && location.state ? location.state : {}
  return (
    <BaseLayout>
      <Authenticated initialCode={state.code}>
        <InvitationCard />
      </Authenticated>
    </BaseLayout>
  )
}
export default InvitationPage
