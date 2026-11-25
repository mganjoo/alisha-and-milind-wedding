import { useContext, useEffect, useRef, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import type { z } from "zod"
import type { WeddingEventMarkdown } from "../../../interfaces/Event"
import type { Invitation } from "../../../interfaces/Invitation"
import {
  makeInitialRsvpFormValues,
  type RsvpFormValues,
  resetAttendeesState,
  toRsvp,
  validationSchema,
} from "../../../interfaces/RsvpFormValues"
import { addRsvp } from "../../../services/Invitation"
import { scrollIntoView, stringEmpty } from "../../../utils/Utils"
import BaseForm from "../../form/BaseForm"
import ButtonRow from "../../form/ButtonRow"
import { FirstErrorFocuserContext } from "../../form/FirstErrorFocuser"
import SubmitButton from "../../form/SubmitButton"
import { useZodForm } from "../../form/useZodForm"
import Alert from "../../ui/Alert"
import Button from "../../ui/Button"
import LeafSpacer from "../../ui/LeafSpacer"
import { InvitationContext } from "../Authenticated"
import ContactEmail from "../ContactEmail"
import RsvpAttendanceSection from "./RsvpAttendanceSection"
import RsvpGuestsSection from "./RsvpGuestsSection"

type Page = 1 | 2

const PAGE_1_FIELDS = ["guests", "attending", "declaration"] as const

interface SectionWrapperProps {
  invitation: Invitation
  events: WeddingEventMarkdown[]
  onDone: (submitted: boolean) => void
  submitError: boolean
}

const SectionWrapper = ({
  invitation,
  events,
  onDone,
  submitError,
}: SectionWrapperProps) => {
  const { getValues, setValue, trigger, reset } =
    useFormContext<RsvpFormValues>()
  const attending = useWatch<RsvpFormValues, "attending">({ name: "attending" })
  const allValues = useWatch<RsvpFormValues>()
  // Set once "Next" has been attempted on page 1; from then on page-1 fields
  // are re-validated on every change (like Formik's validateOnChange), since
  // react-hook-form's onTouched mode only does that for blurred fields.
  const attemptedNextRef = useRef(false)
  const [page, setPage] = useState<Page>(1)
  const previousPageRef = useRef<Page>(1)
  const page1Ref = useRef<HTMLHeadingElement>(null)
  const page2Ref = useRef<HTMLHeadingElement>(null)
  const { forceValidation } = useContext(FirstErrorFocuserContext)

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: `allValues` is an intentional trigger; page 1 is re-validated on every value change after the first "Next" attempt
  useEffect(() => {
    if (attemptedNextRef.current && page === 1) {
      void trigger(PAGE_1_FIELDS)
    }
  }, [allValues, page, trigger])

  const toPage2 = async () => {
    attemptedNextRef.current = true
    const valid = await trigger(PAGE_1_FIELDS)
    if (valid) {
      const values = getValues()
      setValue(
        "attendees",
        resetAttendeesState(events, invitation, (e: WeddingEventMarkdown) =>
          // Keep attendance state intact only for guests whose name is non-empty
          values.attendees[e.frontmatter.shortName]
            ? values.attendees[e.frontmatter.shortName].filter(
                (guestId) => !stringEmpty(values.guests[guestId])
              )
            : []
        )
      )
      setPage(2)
    } else {
      forceValidation()
    }
  }
  const toPage1 = () => setPage(1)
  const handleCancel = () => {
    reset()
    onDone(false)
  }

  return (
    <div>
      {page === 1 && <RsvpGuestsSection ref={page1Ref} />}
      {page === 2 && <RsvpAttendanceSection events={events} ref={page2Ref} />}
      <ButtonRow>
        {page === 2 || (page === 1 && attending === "no") ? (
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
  events: WeddingEventMarkdown[]
  onDone: (submitted: boolean) => void
}

const RsvpForm = ({ events, onDone }: RsvpFormProps) => {
  const { invitation, reloadSaved } = useContext(InvitationContext)
  // Once form is mounted, the initial values remain unchanged
  const [initialValues] = useState<RsvpFormValues>(() =>
    makeInitialRsvpFormValues(invitation, events)
  )
  const [submitError, setSubmitError] = useState(false)
  const form = useZodForm({
    schema: validationSchema,
    defaultValues: initialValues,
  })

  const submitRsvp = async (values: z.output<typeof validationSchema>) => {
    try {
      const newInvitation = await addRsvp(
        invitation,
        toRsvp(values as RsvpFormValues)
      )
      await reloadSaved({ forcedInvitation: newInvitation })
      onDone(true)
    } catch {
      setSubmitError(true)
    }
  }

  return (
    <BaseForm form={form} onSubmit={submitRsvp}>
      <LeafSpacer wide />
      <SectionWrapper
        invitation={invitation}
        events={events}
        onDone={onDone}
        submitError={submitError}
      />
    </BaseForm>
  )
}
export default RsvpForm
