import { type MouseEvent, useContext } from "react"
import type { WeddingEventMarkdown } from "../../../interfaces/Event"
import type { InvitationNavigationState } from "../../../interfaces/InvitationNavigationState"
import { navigate } from "../../../utils/navigation"
import { WeddingMetadataContext } from "../../../utils/WeddingMetadataContext"
import Alert from "../../ui/Alert"
import Link from "../../ui/Link"
import Authenticated from "../Authenticated"
import ReeditableRsvpForm from "./ReeditableRsvpForm"

interface RsvpPageProps {
  events: WeddingEventMarkdown[]
}

const RsvpContent = ({ events }: RsvpPageProps) => {
  const value = useContext(WeddingMetadataContext)
  const viewInvitation = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return
    e.preventDefault()
    navigate("/invitation", {
      state: { fromRsvp: true } as InvitationNavigationState,
    })
  }
  return (
    <div className="c-narrow-body">
      <div className="c-article">
        <p>
          We hope to see you at the wedding! You can view the{" "}
          <Link to="/schedule">Schedule</Link> and <Link to="/faq">FAQ</Link>{" "}
          page for more details, and RSVP using the form below.
        </p>
        <p>
          We would appreciate your RSVP by{" "}
          <strong>{value?.rsvpDeadline}</strong>.
        </p>
        <p>
          We understand that everyone may have different comfort levels around
          traveling or attending large gatherings during this pandemic. We fully
          respect your decision to RSVP accordingly.
        </p>
        <Alert isInfo>
          We ask our guests to please RSVP{" "}
          <strong>
            only if they are or will be fully vaccinated by the start of the
            event.
          </strong>{" "}
          For those who are unable to receive the vaccine, we kindly request a
          negative COVID test within a 48-hour period of attending any wedding
          event.
        </Alert>
        <div className="flex justify-center my-6">
          <Link
            to="/invitation"
            onClick={viewInvitation}
            className="shadow-md c-button c-button-secondary c-button-comfortable"
          >
            View your invitation
          </Link>
        </div>
      </div>
      <ReeditableRsvpForm events={events} />
    </div>
  )
}

/** The gated body of the /rsvp page (everything below the page heading). */
const RsvpPage = ({ events }: RsvpPageProps) => (
  <Authenticated>
    <RsvpContent events={events} />
  </Authenticated>
)
export default RsvpPage
