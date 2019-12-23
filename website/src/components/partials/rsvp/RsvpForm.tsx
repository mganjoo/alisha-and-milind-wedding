import { Formik, useFormikContext, setNestedObjectValues } from "formik"
import React, { useContext, useState, useRef, useEffect, useMemo } from "react"
import { WeddingEventMarkdown, useEvents } from "../../../interfaces/Event"
import { Invitation } from "../../../interfaces/Invitation"
import {
  RsvpFormValues,
  validationSchema,
  resetAttendeesState,
  makeInitialRsvpFormValues,
  toRsvp,
} from "../../../interfaces/RsvpFormValues"
import { addRsvp } from "../../../services/Invitation"
import { scrollIntoView, stringEmpty } from "../../../utils/Utils"
import BaseForm from "../../form/BaseForm"
import ButtonRow from "../../form/ButtonRow"
import SubmitButton from "../../form/SubmitButton"
import Alert from "../../ui/Alert"
import Button from "../../ui/Button"
import LeafSpacer from "../../ui/LeafSpacer"
import { InvitationContext } from "../Authenticated"
import ContactEmail from "../ContactEmail"
import RsvpAttendanceSection from "./RsvpAttendanceSection"
import RsvpGuestsSection from "./RsvpGuestsSection"

type Page = 1 | 2

interface SectionWrapperProps {
  invitation: Invitation
  events: WeddingEventMarkdown[]
  onDone: (submitted: boolean) => void
  submitError: boolean
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  invitation,
  events,
  onDone,
  submitError,
}) => {
  const {
    values,
    validateForm,
    touched,
    setTouched,
    setValues,
    resetForm,
  } = useFormikContext<RsvpFormValues>()
  const [page, setPage] = useState<Page>(1)
  const previousPageRef = useRef<Page>(1)
  const page1Ref = useRef<HTMLDivElement>(null)
  const page2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (page !== previousPageRef.current) {
      // Page switched, so scroll
      if (page === 1 && page1Ref.current) {
        scrollIntoView(page1Ref.current)
      }
      if (page === 2 && page2Ref.current) {
        scrollIntoView(page2Ref.current)
      }
      previousPageRef.current = page
    }
  })

  const toPage2 = () => {
    setTouched({
      ...touched,
      guests: setNestedObjectValues(values.guests, true),
      attending: true,
    })
    validateForm().then(errors => {
      if (!errors.guests && !errors.attending) {
        setValues({
          ...values,
          attendees: resetAttendeesState(
            events,
            !!invitation.preEvents,
            (e: WeddingEventMarkdown) =>
              // Keep attendance state intact only for guests whose name is non-empty
              values.attendees[e.frontmatter.shortName]
                ? values.attendees[e.frontmatter.shortName].filter(
                    guestId => !stringEmpty(values.guests[guestId])
                  )
                : []
          ),
        })
        setPage(2)
      }
    })
  }
  const toPage1 = () => setPage(1)
  const handleCancel = () => {
    resetForm()
    onDone(false)
  }

  return (
    <div>
      {page === 1 && <RsvpGuestsSection ref={page1Ref} />}
      {page === 2 && (
        <RsvpAttendanceSection guests={values.guests} ref={page2Ref} />
      )}
      <ButtonRow full>
        {page === 2 || (page === 1 && values.attending === "no") ? (
          <SubmitButton label="Submit RSVP" />
        ) : (
          <Button onClick={toPage2}>Next: specific events</Button>
        )}
        {page === 2 && (
          <Button onClick={toPage1} purpose="secondary">
            Back: guest details
          </Button>
        )}
        {invitation.latestRsvp && (
          <Button purpose="secondary" onClick={handleCancel}>
            Discard changes
          </Button>
        )}
      </ButtonRow>
      {submitError && (
        <Alert>
          There was a problem submitting the RSVP. Please email us at{" "}
          <ContactEmail />.
        </Alert>
      )}
    </div>
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
        <LeafSpacer />
        <SectionWrapper
          invitation={invitation}
          events={events}
          onDone={onDone}
          submitError={submitError}
        />
      </BaseForm>
    </Formik>
  )
}
export default RsvpForm
