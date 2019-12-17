import React, { useContext } from "react"
import { useEvents } from "../../utils/useEvents"
import { InvitationContext } from "./Authenticated"
import ScheduleItem from "./ScheduleItem"
import { Link } from "gatsby"

interface ScheduleProps {
  siteUrl: string
}

const Schedule: React.FC<ScheduleProps> = ({ siteUrl }) => {
  const events = useEvents()
  const { invitation } = useContext(InvitationContext)
  return (
    <div className="sm:px-10 md:px-0">
      <div className="c-article mb-10">
        {invitation.preEvents ? (
          <p>
            The weekend events are at the{" "}
            <Link to="/travel">San Mateo Marriott</Link> hotel. You are also
            invited to join us for the Haldi and Mehndi events at our Airbnb in
            Half Moon Bay.
          </p>
        ) : (
          <p>
            All events are at the{" "}
            <Link to="/travel">San Mateo Marriott hotel</Link>.
          </p>
        )}
      </div>
      {events
        .filter(e => !e.frontmatter.preEvent || invitation.preEvents)
        .map(event => (
          <ScheduleItem
            key={event.frontmatter.shortName}
            event={event}
            siteUrl={siteUrl}
          />
        ))}
    </div>
  )
}

export default Schedule
