import {
  type Ref,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useFormContext, useWatch } from "react-hook-form"
import type { WeddingEventMarkdown } from "../../../interfaces/Event"
import { isRsvpable } from "../../../interfaces/Invitation"
import { filterNonEmptyKeys } from "../../../utils/Utils"
import { useFieldError } from "../../form/useFieldError"
import Alert from "../../ui/Alert"
import { InvitationContext } from "../Authenticated"
import AttendanceItem from "./AttendanceItem"
import styles from "./RsvpForm.module.css"

interface AttendanceGroupProps {
  events: WeddingEventMarkdown[]
  ref?: Ref<HTMLHeadingElement>
}

const RsvpAttendanceSection = ({ events, ref }: AttendanceGroupProps) => {
  const { invitation } = useContext(InvitationContext)
  const {
    formState: { submitCount },
    trigger,
  } = useFormContext()
  const attendees = useWatch({ name: "attendees" })
  const guests = useWatch({ name: "guests" }) as Record<string, string>
  const attendeesError = useFieldError("attendees")
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: `attendees` is an intentional trigger; the effect must re-run (and re-validate) whenever a checkbox changes
  useEffect(() => {
    // The group-level "make a selection" error lives on `attendees`, which
    // react-hook-form does not re-validate when a child checkbox changes.
    if (attendeesError) void trigger("attendees")
  }, [attendees, attendeesError, trigger])

  useEffect(() => {
    // If attendees field has an error and we just submitted, show an alert
    if (attendeesError && prevSubmitCountRef.current !== submitCount) {
      prevSubmitCountRef.current = submitCount
      setShowError(true)
    } else if (!attendeesError) {
      setShowError(false)
    }
  }, [submitCount, attendeesError])

  return (
    <section
      aria-labelledby="attendance-heading"
      aria-describedby="attendance-description"
    >
      {showError && <Alert>{attendeesError}</Alert>}
      <h2 className={styles.section_heading} id="attendance-heading" ref={ref}>
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
}

export default RsvpAttendanceSection
