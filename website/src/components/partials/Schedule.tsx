import { Link } from "gatsby"
import React, { useContext } from "react"
import { useEvents } from "../../interfaces/Event"
import LeafSpacer from "../ui/LeafSpacer"
import { InvitationContext } from "./Authenticated"
import ScheduleItem from "./ScheduleItem"

const Schedule: React.FC = () => {
  const events = useEvents()
  const { invitation } = useContext(InvitationContext)
  return (
    <>
      <section className="c-article c-narrow-body">
        <p>
          {invitation.preEvents
            ? "The weekend events are "
            : "All events will be held "}
          at the San Mateo Marriott hotel. You can find more information about
          the venue on the <Link to="/travel">Travel &amp; Accommodation</Link>{" "}
          page.
        </p>
        {invitation.preEvents && (
          <p>
            We would also love for you to join us at the Haldi and Mehndi
            events, which will be at our rental home in Half Moon Bay.
          </p>
        )}
        <LeafSpacer wide />
      </section>
      <div className="-mb-12">
        {events
          .filter(e => !e.frontmatter.preEvent || invitation.preEvents)
          .map(event => (
            <ScheduleItem key={event.frontmatter.shortName} event={event} />
          ))}
      </div>
    </>
  )
}

export default Schedule
