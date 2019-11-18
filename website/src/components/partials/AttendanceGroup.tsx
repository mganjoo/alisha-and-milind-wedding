import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react"
import { WeddingEvent } from "../../interfaces/Event"
import AttendanceItem from "./AttendanceItem"
import { useFormikContext } from "formik"
import { RsvpFormValues, GuestMap } from "../../interfaces/RsvpFormValues"
import Alert from "../form/Alert"
import { InvitationContext } from "./Authenticated"
import { useEvents } from "../utils/UtilHooks"

interface AttendanceGroupProps {
  guests: GuestMap
}

const AttendanceGroup: React.FC<AttendanceGroupProps> = ({ guests }) => {
  const events = useEvents()
  const { invitation } = useContext(InvitationContext)
  const { errors, submitCount } = useFormikContext<RsvpFormValues>()
  const prevSubmitCountRef = useRef(submitCount)
  const [showError, setShowError] = useState(false)
  const renderEvents = useCallback(
    (events: WeddingEvent[], preEvents: boolean) => (
      <>
        {events
          .filter(e => e.preEvent === preEvents)
          .map(event => (
            <AttendanceItem
              key={event.shortName}
              event={event}
              guests={guests}
            />
          ))}
      </>
    ),
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
    <div>
      {showError && <Alert>{errors.attendees}</Alert>}
      <p className="font-semibold mt-4 text-lg">Confirm events</p>
      <p className="mb-2">
        Please let us know what events you&apos;ll be attending.
      </p>
      {invitation.preEvents && renderEvents(events, true)}
      {renderEvents(events, false)}
    </div>
  )
}
export default AttendanceGroup
