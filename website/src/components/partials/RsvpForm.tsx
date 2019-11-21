import React, { useContext, useState, useRef, useEffect, useMemo } from "react"
import { InvitationContext } from "./Authenticated"
import { scrollIntoView, recordsEqual } from "../utils/Utils"
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
import { useEvents } from "../utils/UtilHooks"
import { WeddingEvent } from "../../interfaces/Event"
import { Invitation } from "../../interfaces/Invitation"
import { addRsvp } from "../../services/Invitation"
import Alert from "../form/Alert"
import ContactEmail from "./ContactEmail"
import Confirmation from "./Confirmation"
import { Link, useStaticQuery, graphql } from "gatsby"

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
            attendees: resetAttendeesState(events, !!invitation.preEvents),
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
          {!invitation.latestRsvp && (
            <p>
              We&apos;ve filled out some information based on what we know.
              Please edit or correct anything we may have missed!
            </p>
          )}
          <TextInputGroup
            label={guestKeys.length > 1 ? "Names of guests" : "Name"}
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

type SubmissionStatus = "attending" | "not-attending" | undefined

const RsvpForm: React.FC = () => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            shortDeadline: rsvpDeadline(formatString: "MMMM D")
            deadline: rsvpDeadline(formatString: "MMMM D, YYYY")
          }
        }
      }
    `
  )
  const { invitation, reloadSaved } = useContext(InvitationContext)
  const events = useEvents()
  // Once form is mounted, the initial values remain unchanged
  const [initialValues] = useState<RsvpFormValues>(() =>
    makeInitialRsvpFormValues(invitation, events)
  )
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    undefined
  )
  const [submitError, setSubmitError] = useState(false)

  const submitRsvp = useMemo(
    () => async (values: RsvpFormValues) => {
      try {
        const rsvp = toRsvp(values)
        await addRsvp(invitation, toRsvp(values))
        await reloadSaved()
        setSubmissionStatus(rsvp.attending ? "attending" : "not-attending")
      } catch {
        setSubmitError(true)
      }
    },
    [invitation, reloadSaved]
  )

  return (
    <>
      {!submissionStatus && (
        <>
          <div className="c-article text-center max-w-xl">
            {invitation.latestRsvp ? (
              <p>
                Here is the information from your previously submitted RSVP.
                Feel free to edit and submit as many times as you like before{" "}
                {data.site.siteMetadata.deadline}.
              </p>
            ) : (
              <p>
                We hope to see you at our wedding! Please RSVP by{" "}
                {data.site.siteMetadata.deadline}.
              </p>
            )}
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitRsvp}
          >
            <BaseForm className="font-serif max-w-sm w-full">
              {submitError && (
                <Alert className="my-3 mx-4 lg:mx-2">
                  There was a problem submitting the RSVP. Please email us at{" "}
                  <ContactEmail />.
                </Alert>
              )}
              <PageWrapper invitation={invitation} events={events} />
            </BaseForm>
          </Formik>
        </>
      )}
      {submissionStatus && (
        <Confirmation className="flex flex-col items-center text-center px-1 max-w-lg sm:px-4">
          <div className="c-article">
            <p>Thank you for submitting your RSVP.</p>
            {submissionStatus === "attending" && (
              <p>
                We&apos;re excited that you&apos;ll be attending! If you need to
                update your RSVP before {data.site.siteMetadata.shortDeadline},
                you can just visit this page again.
              </p>
            )}
            {submissionStatus === "not-attending" && (
              <p>We&apos;ll miss you!</p>
            )}
            <p className="mt-8">
              <Link to="/">Return to home page</Link>
            </p>
          </div>
        </Confirmation>
      )}
    </>
  )
}
export default RsvpForm
