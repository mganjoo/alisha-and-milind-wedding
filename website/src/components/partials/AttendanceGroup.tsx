import React, { useEffect, useRef, useState, useContext, useMemo } from "react"
import AttendanceItem from "./AttendanceItem"
import { useFormikContext } from "formik"
import { RsvpFormValues, GuestMap } from "../../interfaces/RsvpFormValues"
import Alert from "../form/Alert"
import { InvitationContext } from "./Authenticated"
import { useEvents } from "../../interfaces/Event"
import { filterNonEmptyKeys } from "../../utils/Utils"

interface AttendanceGroupProps {
  guests: GuestMap
}

const AttendanceGroup: React.FC<AttendanceGroupProps> = ({ guests }) => {
  const events = useEvents()
  const { invitation } = useContext(InvitationContext)
  const { errors, submitCount } = useFormikContext<RsvpFormValues>()
  const prevSubmitCountRef = useRef(submitCount)
  const [showError, setShowError] = useState(false)
  const eventsToShow = useMemo(
    () => events.filter(e => !e.frontmatter.preEvent || invitation.preEvents),
    [events, invitation]
  )
  const options = useMemo(
    () =>
      filterNonEmptyKeys(guests).map(id => ({
        value: id,
        label: guests[id],
      })),
    [guests]
  )

  useEffect(() => {
    // If attendees field has an error and we just submitted, show an alert
    if (errors.attendees && prevSubmitCountRef.current !== submitCount) {
      prevSubmitCountRef.current = submitCount
      setShowError(true)
    } else if (!errors.attendees) {
      setShowError(false)
    }
  }, [submitCount, errors.attendees])

  return (
    <div
      role="group"
      aria-labelledby="confirm-events-heading"
      aria-describedby="confirm-events-description"
    >
      {showError && <Alert className="mb-4 w-full">{errors.attendees}</Alert>}
      <h2 className="c-form-section-heading" id="confirm-events-heading">
        Specific events
      </h2>
      <p className="c-form-section-description" id="confirm-events-description">
        Please select the{" "}
        {options.length > 1
          ? "names of the guests attending each event"
          : "events you'll be attending"}
        . You can always come back and edit this later if your plans change.
      </p>
      {eventsToShow.map(event => (
        <AttendanceItem
          key={event.frontmatter.shortName}
          event={event}
          guestOptions={options}
        />
      ))}
    </div>
  )
}
export default AttendanceGroup
