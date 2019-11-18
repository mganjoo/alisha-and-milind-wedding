import React, { useContext, useState, useMemo, useRef, useEffect } from "react"
import { InvitationContext } from "./Authenticated"
import { makeIdMap, range, scrollIntoView, recordsEqual } from "../utils/Utils"
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
} from "../../interfaces/RsvpFormValues"
import Button from "../ui/Button"
import AttendanceGroup from "./AttendanceGroup"
import { useEvents } from "../utils/UtilHooks"
import { WeddingEvent } from "../../interfaces/Event"
import { Invitation, Rsvp } from "../../interfaces/Invitation"
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

function resetAttendeesInitialState(
  events: WeddingEvent[],
  includePreEvents: boolean
): Record<string, string[]> {
  return events
    .filter(e => (includePreEvents ? true : !e.preEvent))
    .reduce(
      (state, e) => {
        state[e.shortName] = []
        return state
      },
      {} as Record<string, string[]>
    )
}

type Page = "guests" | "attendance"

interface PageWrapperProps {
  invitation: Invitation
  events: WeddingEvent[]
}

const PageWrapper: React.FC<PageWrapperProps> = ({ invitation, events }) => {
  const { values, validateForm, setValues } = useFormikContext<RsvpFormValues>()
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
            attendees: resetAttendeesInitialState(
              events,
              !!invitation.preEvents
            ),
          })
          setGuestsForAttendancePage(values.guests)
        }
        setPage("attendance")
      }
    })
  }
  const toGuests = () => setPage("guests")

  const guestKeys = Object.keys(values.guests)
  return (
    <>
      <div className="mt-1 mb-4 text-center">
        <LeafSpacer />
      </div>
      {page === "guests" && (
        <div ref={guestsRef}>
          <TextInputGroup
            label={
              guestKeys.length > 1
                ? "Please confirm the names of guests in your party."
                : "Name"
            }
            groupName="guests"
            fieldKeys={guestKeys}
            fieldLabelFn={i =>
              `Name of ${ordinalSuffix(i)} guest${i === 1 ? " (required)" : ""}`
            }
          />
          <OptionsGroup
            name="attending"
            type="radio"
            label="Will you be attending?"
            options={attendingOptions}
          />
        </div>
      )}
      {page === "attendance" && (
        <div ref={eventsRef}>
          <AttendanceGroup guests={guestsForAttendancePage} />
        </div>
      )}
      <div className="mt-6 flex">
        {page === "attendance" && (
          <Button onClick={toGuests} className="mr-3" isSecondary>
            Back: edit guests
          </Button>
        )}
        {page === "attendance" ||
        (page === "guests" && values.attending === "no") ? (
          <SubmitButton label="Submit RSVP" />
        ) : (
          <Button onClick={toEvents}>Next: confirm events</Button>
        )}
      </div>
    </>
  )
}

interface RsvpFormProps {
  onSubmit?: () => void
}

const RsvpForm: React.FC<RsvpFormProps> = ({ onSubmit }) => {
  const { invitation, reloadSaved } = useContext(InvitationContext)
  const [initialGuests] = useState(() =>
    makeIdMap(range(invitation.numGuests), (i: number) =>
      i < invitation.knownGuests.length ? invitation.knownGuests[i] : ""
    )
  )
  const events = useEvents()
  const initialValues: RsvpFormValues = useMemo(
    () => ({
      guests: initialGuests,
      attending: "-",
      attendees: resetAttendeesInitialState(events, !!invitation.preEvents),
    }),
    [initialGuests, events, invitation]
  )
  const [submitError, setSubmitError] = useState(false)

  async function submitRsvp(values: RsvpFormValues) {
    const attending = values.attending === "yes"
    const guests = Object.keys(values.guests).map(id => ({
      name: values.guests[id],
      events: Object.keys(values.attendees).filter(
        eventName => attending && values.attendees[eventName].includes(id)
      ),
    }))
    const rsvp: Rsvp = { guests, attending: attending }
    try {
      await addRsvp(invitation, rsvp)
      await reloadSaved()
      if (onSubmit) {
        onSubmit()
      }
    } catch {
      setSubmitError(true)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitRsvp}
    >
      <BaseForm className="font-serif max-w-xs w-full mb-10">
        {submitError && (
          <Alert className="my-3 mx-4 lg:mx-2">
            There was a problem submitting the RSVP. Please email us at{" "}
            <ContactEmail />.
          </Alert>
        )}
        <PageWrapper invitation={invitation} events={events} />
      </BaseForm>
    </Formik>
  )
}
export default RsvpForm
