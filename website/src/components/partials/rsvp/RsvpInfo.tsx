import dayjs from "dayjs"
import React, { useContext } from "react"
import ButtonRow from "../../form/ButtonRow"
import Button from "../../ui/Button"
import Symbol from "../../ui/Symbol"
import { InvitationContext } from "../Authenticated"

function formatDate(timestampMillis: number) {
  return dayjs(timestampMillis).format("MMM D [at] h:mm a")
}

interface RsvpInfoProps {
  handleEditRsvp?: () => void
}

const RsvpInfo: React.FC<RsvpInfoProps> = ({ handleEditRsvp }) => {
  const { invitation } = useContext(InvitationContext)
  if (!invitation.latestRsvp) {
    return null
  } else {
    const guestsWithAtLeastOneEvent = invitation.latestRsvp.guests.filter(
      (guest) => guest.events.length > 0
    )
    return (
      <section
        aria-label="RSVP status"
        aria-describedby="rsvp-info-name rsvp-info-description"
        className="flex flex-col items-center justify-center font-serif max-w-sm mx-auto c-shadow-box"
      >
        <div className="flex flex-wrap items-center justify-center mb-6">
          <Symbol
            aria-hidden
            symbol={invitation.latestRsvp.attending ? "check" : "cross"}
            className="m-2 text-tertiary dark:text-tertiary-night"
            size="l"
          />
          <div className="mx-2 text-center">
            <h2
              className="font-sans font-semibold mb-1 text-2xl"
              id="rsvp-info-name"
            >
              {invitation.partyName}
            </h2>
            <p
              className="font-sans italic text-sm text-secondary dark:text-secondary-night"
              id="rsvp-info-description"
            >
              RSVP received on{" "}
              <span className="font-semibold whitespace-nowrap not-italic text-primary p-hide dark:text-primary-night">
                {formatDate(invitation.latestRsvp.timestampMillis)}
              </span>
            </p>
          </div>
        </div>
        <div className="mb-4 flex flex-col items-center">
          <h3 className="font-sans font-semibold text-center text-accent-text mb-1 text-lg dark:text-accent-text-night print:text-heading-print">
            {invitation.latestRsvp.attending
              ? `${guestsWithAtLeastOneEvent.length} ${
                  guestsWithAtLeastOneEvent.length > 1 ? "guests" : "guest"
                } attending`
              : "Not attending"}
          </h3>
          {invitation.latestRsvp.attending && (
            <ul className="font-serif">
              {guestsWithAtLeastOneEvent.map((guest) => (
                <li key={guest.name}>{guest.name}</li>
              ))}
            </ul>
          )}
        </div>
        <ButtonRow>
          <Button
            onClick={handleEditRsvp}
            disabled={handleEditRsvp === undefined}
          >
            Edit RSVP
          </Button>
        </ButtonRow>
      </section>
    )
  }
}

export default RsvpInfo
