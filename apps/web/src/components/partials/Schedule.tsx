import { useContext } from "react"
import type { WeddingEventMarkdown } from "../../interfaces/Event"
import { isRsvpable } from "../../interfaces/Invitation"
import { WeddingMetadataContext } from "../../utils/WeddingMetadataContext"
import LeafSpacer from "../ui/LeafSpacer"
import Link from "../ui/Link"
import { InvitationContext } from "./Authenticated"
import ScheduleItem from "./ScheduleItem"

interface ScheduleProps {
  events: WeddingEventMarkdown[]
}

const Schedule = ({ events }: ScheduleProps) => {
  const metadata = useContext(WeddingMetadataContext)
  const { invitation } = useContext(InvitationContext)
  return (
    <>
      <section className="c-article">
        <p>
          The wedding celebration will be at{" "}
          <strong>{metadata?.mainVenue[0]}</strong>. You can find more
          information about the venue on the{" "}
          <Link to="/travel">Travel &amp; Hotel</Link> page, and more details
          about attire on the <Link to="/faq">FAQ</Link> page.
        </p>
        <LeafSpacer wide />
      </section>
      <div className="-mb-8">
        {events
          .filter((e) => isRsvpable(e, invitation))
          .map((event) => (
            <ScheduleItem key={event.frontmatter.shortName} event={event} />
          ))}
      </div>
    </>
  )
}

export default Schedule
