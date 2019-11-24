import React, { useContext, useState } from "react"
import { InvitationContext } from "./Authenticated"
import { DeadlinesResult } from "../../interfaces/Event"
import { useStaticQuery, graphql } from "gatsby"
import dayjs from "dayjs"
import Symbol from "../ui/Symbol"
import Button from "../ui/Button"
import classnames from "classnames"
import RsvpForm from "./RsvpForm"

function formatDate(timestampMillis: number) {
  return dayjs(timestampMillis).format("MMM D [at] h:mm a")
}

interface RsvpStatusProps {}

const RsvpStatus: React.FC<RsvpStatusProps> = () => {
  const { invitation } = useContext(InvitationContext)
  const { site }: { site: DeadlinesResult } = useStaticQuery(
    graphql`
      query {
        site {
          ...Deadlines
        }
      }
    `
  )
  const statusIconClassName = "w-10 h-10 ml-2 mr-6"
  const [showForm, setShowForm] = useState(invitation.latestRsvp === undefined)
  return (
    <div className="px-2 max-w-xl sm:px-0">
      <p className="c-body-text">
        We hope to see you at our wedding! Please RSVP by{" "}
        <span className="font-semibold">{site.siteMetadata.deadline}</span>.
      </p>
      <p className="c-body-text">
        Any member of your party can submit for the whole group, and you can
        edit your RSVP as many times as you like before{" "}
        {site.siteMetadata.shortDeadline}.
      </p>
      {!showForm && invitation.latestRsvp && (
        <section
          className="font-serif text-base border py-4 px-3 mt-8 rounded-lg flex items-center border-gray-800 sm:py-6 sm:px-4"
          aria-label="RSVP status"
        >
          <Symbol
            symbol={invitation.latestRsvp.attending ? "check" : "cross"}
            className={classnames(statusIconClassName, "text-gray-600")}
          />
          <div className="font-sans">
            <h2 className="mb-1 font-bold text-lg">{invitation.partyName}</h2>
            <p>
              RSVP received on{" "}
              <span className="font-semibold whitespace-no-wrap">
                {formatDate(invitation.latestRsvp.timestampMillis)}
              </span>
            </p>
            <p className="mt-1 font-semibold">
              {invitation.latestRsvp.attending
                ? `${invitation.latestRsvp.guests.length} ${
                    invitation.latestRsvp.guests.length > 1 ? "guests" : "guest"
                  } attending`
                : "Not attending"}
            </p>
            <Button
              className="mt-3"
              fit="compact"
              onClick={() => setShowForm(true)}
            >
              Edit RSVP
            </Button>
          </div>
        </section>
      )}
      {showForm && <RsvpForm onDone={() => setShowForm(false)} />}
    </div>
  )
}

export default RsvpStatus
