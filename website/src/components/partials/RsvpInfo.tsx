import React, { useContext } from "react"
import { InvitationContext } from "./Authenticated"
import Button from "../ui/Button"
import classnames from "classnames"
import Symbol from "../ui/Symbol"
import dayjs from "dayjs"

function formatDate(timestampMillis: number) {
  return dayjs(timestampMillis).format("MMM D [at] h:mm a")
}

interface RsvpInfoProps {
  handleEditRsvp: () => void
}

const RsvpInfo: React.FC<RsvpInfoProps> = ({ handleEditRsvp }) => {
  const { invitation } = useContext(InvitationContext)
  return !invitation.latestRsvp ? null : (
    <section aria-label="RSVP status" className="flex justify-center">
      <div className="font-serif mt-8 px-6 py-6 flex flex-col items-center border c-subtle-border rounded-lg sm:px-8">
        <div className="flex flex-col items-center sm:flex-row">
          <Symbol
            symbol={invitation.latestRsvp.attending ? "check" : "cross"}
            className={classnames(
              "w-10 h-10 mb-4 sm:w-12 sm:h-12 sm:mr-4",
              "text-gray-600"
            )}
          />
          <div className="text-center sm:text-left">
            <h2 className="font-display mb-1 text-2xl">
              {invitation.partyName}
            </h2>
            <p className="font-sans italic text-sm text-gray-700 mb-6">
              RSVP received on{" "}
              <span className="font-semibold whitespace-no-wrap not-italic text-gray-900 rsvp-received-date">
                {formatDate(invitation.latestRsvp.timestampMillis)}
              </span>
            </p>
          </div>
        </div>
        <div>
          <p className="font-sans font-semibold text-orange-800 mb-1">
            {invitation.latestRsvp.attending
              ? `${invitation.latestRsvp.guests.length} ${
                  invitation.latestRsvp.guests.length > 1 ? "guests" : "guest"
                } attending`
              : "Not attending"}
          </p>
          {invitation.latestRsvp.attending && (
            <ul className="font-serif">
              {invitation.latestRsvp.guests.map(guest => (
                <li key={guest.name}>{guest.name}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-center mt-6 w-full">
          <Button className="w-full" onClick={handleEditRsvp}>
            Edit RSVP
          </Button>
        </div>
      </div>
    </section>
  )
}

export default RsvpInfo
