import React, { useContext } from "react"
import { InvitationContext } from "../Authenticated"
import Button from "../../ui/Button"
import classnames from "classnames"
import Symbol from "../../ui/Symbol"
import dayjs from "dayjs"
import ButtonRow from "../../form/ButtonRow"

function formatDate(timestampMillis: number) {
  return dayjs(timestampMillis).format("MMM D [at] h:mm a")
}

interface RsvpInfoProps {
  handleEditRsvp: () => void
}

const RsvpInfo: React.FC<RsvpInfoProps> = ({ handleEditRsvp }) => {
  const { invitation } = useContext(InvitationContext)
  return !invitation.latestRsvp ? null : (
    <section
      aria-label="RSVP status"
      aria-describedby="rsvp-info-name rsvp-info-description"
      className="flex flex-col items-center justify-center font-serif max-w-md mx-auto c-shadow-box"
    >
      <div className="flex flex-col items-center sm:flex-row">
        <Symbol
          aria-hidden
          symbol={invitation.latestRsvp.attending ? "check" : "cross"}
          className={classnames(
            "mb-4 sm:w-12 sm:h-12 sm:mr-4",
            "text-gray-600"
          )}
          svgClassName={classnames("w-10 h-10")}
        />
        <div className="text-center mb-6 sm:text-left">
          <h2 className="font-display mb-1 text-2xl" id="rsvp-info-name">
            {invitation.partyName}
          </h2>
          <p
            className="font-sans italic text-sm text-gray-700"
            id="rsvp-info-description"
          >
            RSVP received on{" "}
            <span className="font-semibold whitespace-no-wrap not-italic text-gray-900 p-hide">
              {formatDate(invitation.latestRsvp.timestampMillis)}
            </span>
          </p>
        </div>
      </div>
      <div className="mb-3 flex flex-col items-center">
        <h3 className="font-sans font-semibold text-center text-orange-800 mb-1">
          {invitation.latestRsvp.attending
            ? `${invitation.latestRsvp.guests.length} ${
                invitation.latestRsvp.guests.length > 1 ? "guests" : "guest"
              } attending`
            : "Not attending"}
        </h3>
        {invitation.latestRsvp.attending && (
          <ul className="font-serif">
            {invitation.latestRsvp.guests.map(guest => (
              <li key={guest.name}>{guest.name}</li>
            ))}
          </ul>
        )}
      </div>
      <ButtonRow full>
        <Button onClick={handleEditRsvp}>Edit RSVP</Button>
      </ButtonRow>
    </section>
  )
}

export default RsvpInfo
