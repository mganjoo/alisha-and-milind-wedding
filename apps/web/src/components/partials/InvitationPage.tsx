import { useState } from "react"
import { isInvitationNavigationState } from "../../interfaces/InvitationNavigationState"
import type { PictureData } from "../../lib/picture"
import { consumeNavigationState } from "../../utils/navigation"
import InvitationCard from "./InvitationCard"

interface InvitationPageProps {
  letter: PictureData
}

/** The /invitation page body: the card, plus the "arrived from RSVP" state. */
const InvitationPage = ({ letter }: InvitationPageProps) => {
  // Only read on the client. The card itself is not rendered until the saved
  // invitation has loaded (after hydration), so this cannot cause a mismatch.
  const [arrivedFromRsvp] = useState(() => {
    if (typeof window === "undefined") return false
    const state = consumeNavigationState<unknown>()
    return isInvitationNavigationState(state) ? state.fromRsvp : false
  })
  const returnLink = arrivedFromRsvp
    ? { label: "Back to website", url: "/rsvp" }
    : undefined
  return (
    <InvitationCard
      letter={letter}
      playing
      startDelayMs={2000}
      skipAnimation={arrivedFromRsvp}
      navLink={returnLink}
    />
  )
}
export default InvitationPage
