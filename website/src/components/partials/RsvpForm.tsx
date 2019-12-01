import React, { useContext, useState, useRef, useEffect, useMemo } from "react"
import { InvitationContext } from "./Authenticated"
import { scrollIntoView, recordsEqual } from "../../utils/Utils"
import BaseForm from "../form/BaseForm"
import { Formik, useFormikContext } from "formik"
import SubmitButton from "../form/SubmitButton"
import OptionsGroup from "../form/OptionsGroup"
import TextInputGroup from "../form/TextInputGroup"
import LeafSpacer from "../ui/LeafSpacer"
import {
  RsvpFormValues,
  validationSchema,
  GuestMap,
  resetAttendeesState,
  makeInitialRsvpFormValues,
  toRsvp,
} from "../../interfaces/RsvpFormValues"
import Button from "../ui/Button"
import AttendanceGroup from "./AttendanceGroup"
import { useEvents } from "../../utils/useEvents"
import { WeddingEvent } from "../../interfaces/Event"
import { Invitation } from "../../interfaces/Invitation"
import { addRsvp } from "../../services/Invitation"
import Alert from "../form/Alert"
import ContactEmail from "./ContactEmail"

const attendingOptions = [
  { value: "yes", label: "Yes, excited to attend!" },
  { value: "no", label: "No, will celebrate from afar." },
]

function ordinalSuffix(i: number) {
  const ones = i % 10
  const tens = i % 100

  return ones === 1 && tens !== 11
    ? `${i}st`
    : ones === 2 && tens !== 12
    ? `${i}nd`
    : ones === 3 && tens !== 13
    ? `${i}rd`
    : `${i}th`
}

type Page = "guests" | "attendance"

interface PageWrapperProps {
  invitation: Invitation
  events: WeddingEvent[]
  onDone: (submitted: boolean) => void
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  invitation,
  events,
  onDone,
}) => {
  const {
    initialValues,
    values,
    validateForm,
    setValues,
    resetForm,
  } = useFormikContext<RsvpFormValues>()
  const [page, setPage] = useState<Page>("guests")

  // Snapshot of guests for events page
  const [guestsForAttendancePage, setGuestsForAttendancePage] = useState<
    GuestMap
  >(() => values.guests)

  // Refs for scrolling
  const previousPageRef = useRef<Page>("guests")
  const guestsRef = useRef<HTMLDivElement>(null)
  const eventsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (page !== previousPageRef.current) {
      // Page switched, so scroll
      if (page === "guests" && guestsRef.current) {
        scrollIntoView(guestsRef.current)
      }
      if (page === "attendance" && eventsRef.current) {
        scrollIntoView(eventsRef.current)
      }
      previousPageRef.current = page
    }
  })

  const toEvents = () => {
    validateForm().then(errors => {
      if (!errors.guests && !errors.attending) {
        // Reset attendees if names of guests changed
        if (!recordsEqual(guestsForAttendancePage, values.guests)) {
          setValues({
            ...values,
            attendees: resetAttendeesState(events, !!invitation.preEvents),
          })
          setGuestsForAttendancePage(values.guests)
        }
        setPage("attendance")
      }
    })
  }
  const toGuests = () => setPage("guests")
  const buttonClassName = "mb-4 mx-2 flex-auto"
  const handleCancel = () => {
    resetForm()
    onDone(false)
  }

  const guestKeys = Object.keys(values.guests)
  return (
    <>
      {page === "guests" && (
        <div ref={guestsRef}>
          <h3
            className={
              invitation.numGuests === 1
                ? "c-form-section-heading"
                : "font-sans text-sm text-orange-800 italic"
            }
          >
            {invitation.latestRsvp ? "Editing RSVP" : "Welcome"}
          </h3>
          {invitation.numGuests > 1 && (
            <h3 className="c-form-section-heading">{invitation.partyName}</h3>
          )}
          <p className="c-form-section-description">
            {invitation.latestRsvp ? (
              <>
                Here is the information from your previous submission. Feel free
                to make changes and submit the RSVP again.
              </>
            ) : (
              <>
                We&apos;ve filled out some information based on what we know.
                Please edit or correct anything we may have missed.
              </>
            )}
          </p>
          <TextInputGroup
            label={guestKeys.length > 1 ? "Names of guests" : "Name"}
            groupName="guests"
            fieldKeys={guestKeys}
            fieldLabelFn={i =>
              `Name of ${ordinalSuffix(i)} guest${
                i > invitation.knownGuests.length ? " (optional)" : ""
              }`
            }
          />
          <OptionsGroup
            name="attending"
            type="radio"
            label="Will you be attending?"
            options={attendingOptions}
          />
          {initialValues.attending !== values.attending && (
            <div className="-mb-2 font-sans text-center text-sm text-orange-900 italic">
              {values.attending === "yes" &&
                "Yay! One more step: confirm attendance for specific events on the next page."}
            </div>
          )}
        </div>
      )}
      {page === "attendance" && (
        <div ref={eventsRef}>
          <AttendanceGroup guests={guestsForAttendancePage} />
        </div>
      )}
      <div className="mt-6 px-2 flex flex-wrap flex-row-reverse">
        {page === "attendance" ||
        (page === "guests" && values.attending === "no") ? (
          <SubmitButton label="Submit RSVP" className={buttonClassName} />
        ) : (
          <Button onClick={toEvents} className={buttonClassName}>
            Next: specific events
          </Button>
        )}
        {page === "attendance" && (
          <Button
            onClick={toGuests}
            className={buttonClassName}
            purpose="secondary"
          >
            Back: guest details
          </Button>
        )}
        {invitation.latestRsvp && (
          <Button
            purpose="secondary"
            className={buttonClassName}
            onClick={handleCancel}
          >
            Discard changes
          </Button>
        )}
      </div>
    </>
  )
}

interface RsvpFormProps {
  onDone: (submitted: boolean) => void
}

const RsvpForm: React.FC<RsvpFormProps> = ({ onDone }) => {
  const { invitation, reloadSaved } = useContext(InvitationContext)
  const events = useEvents()
  // Once form is mounted, the initial values remain unchanged
  const [initialValues] = useState<RsvpFormValues>(() =>
    makeInitialRsvpFormValues(invitation, events)
  )
  const [submitError, setSubmitError] = useState(false)

  const submitRsvp = useMemo(
    () => async (values: RsvpFormValues) => {
      try {
        await addRsvp(invitation, toRsvp(values))
        await reloadSaved()
        onDone(true)
      } catch {
        setSubmitError(true)
      }
    },
    [invitation, reloadSaved, onDone]
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitRsvp}
    >
      <BaseForm>
        <div className="my-6 text-center">
          <LeafSpacer />
        </div>
        <PageWrapper invitation={invitation} events={events} onDone={onDone} />
        {submitError && (
          <Alert className="mt-4">
            There was a problem submitting the RSVP. Please email us at{" "}
            <ContactEmail />.
          </Alert>
        )}
      </BaseForm>
    </Formik>
  )
}
export default RsvpForm
