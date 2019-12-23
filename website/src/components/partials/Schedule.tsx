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
    <div className="sm:px-10 md:px-0">
      <div className="c-article mb-8 max-w-xl mx-auto">
        {invitation.preEvents ? (
          <>
            <p>
              The weekend events are at the{" "}
              <Link to="/travel">San Mateo Marriott</Link> hotel.
            </p>
            <p>
              We would also love for you to join us at the Haldi and Mehndi
              events, which will be at our rental home in Half Moon Bay.
            </p>
          </>
        ) : (
          <p>
            All events will be held at the{" "}
            <Link to="/travel">San Mateo Marriott hotel</Link>.
          </p>
        )}
        <LeafSpacer />
      </div>
      {events
        .filter(e => !e.frontmatter.preEvent || invitation.preEvents)
        .map(event => (
          <ScheduleItem key={event.frontmatter.shortName} event={event} />
        ))}
    </div>
  )
}

export default Schedule
