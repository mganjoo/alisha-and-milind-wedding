import React, { useContext } from "react"
import { useEvents } from "../../utils/useEvents"
import { InvitationContext } from "./Authenticated"

const Schedule = () => {
  const events = useEvents()
  const { invitation } = useContext(InvitationContext)
  return (
    <div>
      {events
        .filter(e => !e.frontmatter.preEvent || invitation.preEvents)
        .map(event => (
          <div key={event.frontmatter.shortName}>
            <p>{event.frontmatter.name}</p>
            <p>{event.frontmatter.shortDate}</p>
            <div
              className="c-article"
              dangerouslySetInnerHTML={{ __html: event.html }}
            />
          </div>
        ))}
    </div>
  )
}

export default Schedule
