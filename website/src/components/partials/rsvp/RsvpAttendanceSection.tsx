import { useFormikContext } from "formik"
import React, { useEffect, useRef, useState, useContext, useMemo } from "react"
import { useEvents } from "../../../interfaces/Event"
import { isRsvpable } from "../../../interfaces/Invitation"
import { RsvpFormValues, GuestMap } from "../../../interfaces/RsvpFormValues"
import { filterNonEmptyKeys } from "../../../utils/Utils"
import Alert from "../../ui/Alert"
import { InvitationContext } from "../Authenticated"
import AttendanceItem from "./AttendanceItem"
import { section_heading } from "./RsvpForm.module.css"

interface AttendanceGroupProps {
  guests: GuestMap
}

const RsvpAttendanceSection = React.forwardRef<
  HTMLHeadingElement,
  AttendanceGroupProps
>(({ guests }, ref) => {
  const events = useEvents()
  const { invitation } = useContext(InvitationContext)
  const { errors, submitCount } = useFormikContext<RsvpFormValues>()
  const prevSubmitCountRef = useRef(submitCount)
  const [showError, setShowError] = useState(false)
  const eventsToShow = useMemo(
    () => events.filter((e) => isRsvpable(e, invitation)),
    [events, invitation]
  )
  const options = useMemo(
    () =>
      filterNonEmptyKeys(guests).map((id) => ({
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
    <section
      aria-labelledby="attendance-heading"
      aria-describedby="attendance-description"
    >
      {showError && <Alert>{errors.attendees}</Alert>}
      <h2 className={section_heading} id="attendance-heading" ref={ref}>
        Specific events
      </h2>
      <p className="c-form-description" id="attendance-description">
        {options.length > 1
          ? "Please select the names of the guests who will attend"
          : "Please confirm your attendance below"}
        . You can come back and edit this later if your plans change.
      </p>
      {eventsToShow.map((event) => (
        <AttendanceItem
          key={event.frontmatter.shortName}
          event={event}
          guestOptions={options}
        />
      ))}
    </section>
  )
})

export default RsvpAttendanceSection
