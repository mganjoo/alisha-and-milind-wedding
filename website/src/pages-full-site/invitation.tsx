import React, { useState } from "react"
import { RouteComponentProps } from "@reach/router"
import InvitationCard from "../components/partials/InvitationCard"
import BaseLayout from "../components/layout/BaseLayout"
import Authenticated from "../components/partials/Authenticated"
import { Link } from "gatsby"
import { useSpring, animated } from "react-spring"

interface InvitationPageNavigationState {
  code?: string
}

const InvitationPage: React.FC<RouteComponentProps> = ({ location }) => {
  const state: InvitationPageNavigationState =
    location && location.state ? location.state : {}
  const [showLinks, setShowLinks] = useState(false)
  const linksProps = useSpring({ opacity: showLinks ? 1 : 0 })
  return (
    <BaseLayout additionalBodyClassName="overflow-x-hidden">
      <Authenticated initialCode={state.code}>
        <main className="flex flex-col">
          <div className="flex-1 flex justify-center items-center">
            <InvitationCard
              startAutomatically
              onOpen={() => setShowLinks(true)}
            />
          </div>
          <animated.div className="flex justify-center" style={linksProps}>
            <Link
              className="text-center c-button c-button-primary c-button-comfortable shadow-lg"
              to="/"
            >
              Enter website
            </Link>
          </animated.div>
        </main>
      </Authenticated>
    </BaseLayout>
  )
}
export default InvitationPage
