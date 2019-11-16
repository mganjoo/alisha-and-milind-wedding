import React, { useContext, useState, useMemo, useRef, useEffect } from "react"
import { InvitationContext } from "./Authenticated"
import { makeIdMap, range, scrollIntoView } from "../utils/Utils"
import BaseForm from "../form/BaseForm"
import { Formik, useFormikContext } from "formik"
import SubmitButton from "../form/SubmitButton"
import OptionsGroup from "../form/OptionsGroup"
import TextInputGroup from "../form/TextInputGroup"
import LeafSpacer from "../ui/LeafSpacer"
import {
  RsvpFormValues,
  validationSchema,
} from "../../interfaces/RsvpFormValues"
import Button from "../ui/Button"
import AttendanceGroup from "./AttendanceGroup"

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

const attendeesInitialState: Record<string, string[]> = {
  mehendi: [],
  sangeet: [],
  ceremony: [],
  reception: [],
}

async function submitRsvp(values: RsvpFormValues) {
  console.log({ ...values, attending: values.attending === "yes" })
}

const PageWrapper: React.FC = () => {
  const { values, validateForm, setValues } = useFormikContext<RsvpFormValues>()
  const [page, setPage] = useState<"guests" | "events">("guests")
  const previousPageRef = useRef<"guests" | "events">("guests")

  // Refs for scrolling
  const guestsRef = useRef<HTMLDivElement>(null)
  const eventsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (page !== previousPageRef.current) {
      // Page switched, so scroll
      if (page === "guests" && guestsRef.current) {
        scrollIntoView(guestsRef.current)
      }
      if (page === "events" && eventsRef.current) {
        scrollIntoView(eventsRef.current)
      }

      previousPageRef.current = page
    }
  })

  const toEvents = () => {
    validateForm().then(errors => {
      if (!errors.guests && !errors.attending) {
        // Reset attendees, so they can be selected again accordingly
        setValues({ ...values, attendees: attendeesInitialState })
        setPage("events")
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
      {page === "events" && (
        <div ref={eventsRef}>
          <AttendanceGroup />
        </div>
      )}
      <div className="mt-6 flex">
        {page === "events" && (
          <Button onClick={toGuests} className="mr-3" isSecondary>
            Back: edit guests
          </Button>
        )}
        {page === "events" ||
        (page === "guests" && values.attending === "no") ? (
          <SubmitButton label="Submit RSVP" />
        ) : (
          <Button onClick={toEvents}>Next: confirm events</Button>
        )}
      </div>
    </>
  )
}

const RsvpForm: React.FC = () => {
  const invitation = useContext(InvitationContext)
  const [initialGuests] = useState(() =>
    makeIdMap(range(invitation.numGuests), (i: number) =>
      i < invitation.knownGuests.length ? invitation.knownGuests[i] : ""
    )
  )
  const initialValues: RsvpFormValues = useMemo(
    () => ({
      guests: initialGuests,
      attending: "-",
      attendees: attendeesInitialState,
    }),
    [initialGuests]
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitRsvp}
    >
      <BaseForm className="font-serif max-w-xs w-full mb-10">
        <PageWrapper />
      </BaseForm>
    </Formik>
  )
}
export default RsvpForm
