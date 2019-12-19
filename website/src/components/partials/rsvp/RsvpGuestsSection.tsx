import React, { useContext } from "react"
import { InvitationContext } from "../Authenticated"
import TextInputGroup from "../../form/TextInputGroup"
import OptionsGroup from "../../form/OptionsGroup"
import { useFormikContext } from "formik"
import { RsvpFormValues } from "../../../interfaces/RsvpFormValues"
import classnames from "classnames"
import "./RsvpForm.module.css"

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

const attendingOptions = [
  { value: "yes", label: "Yes, excited to attend!" },
  { value: "no", label: "No, will celebrate from afar." },
]

const RsvpGuestsSection = React.forwardRef<HTMLDivElement>((_props, ref) => {
  const { invitation } = useContext(InvitationContext)
  const { initialValues, values } = useFormikContext<RsvpFormValues>()
  const guestKeys = Object.keys(values.guests)

  return (
    <section
      ref={ref}
      aria-labelledby={classnames("guests-heading-1", {
        "guests-heading-2": invitation.numGuests > 1,
      })}
      aria-describedby="guests-description"
    >
      <h2
        styleName={
          invitation.numGuests === 1 ? "section-heading" : "section-subheading"
        }
        id="guests-heading-1"
      >
        {invitation.latestRsvp ? "Editing RSVP" : "Welcome"}
      </h2>
      {invitation.numGuests > 1 && (
        <h3 styleName="section-heading" id="guests-heading-2">
          {invitation.partyName}
        </h3>
      )}
      <p className="c-form-description" id="guests-description">
        {invitation.latestRsvp ? (
          <>
            Here is the information from your previous submission. Feel free to
            make changes and submit the RSVP again.
          </>
        ) : (
          <>
            We&apos;ve filled out some information based on what we know. Please
            edit or correct anything we may have missed.
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
      {initialValues.attending !== values.attending &&
        values.attending === "yes" && (
          <div
            role="status"
            className="mb-1 font-sans text-center text-sm text-orange-900 italic"
          >
            Yay! One more step: confirm attendance for specific events on the
            next page.
          </div>
        )}
    </section>
  )
})

export default RsvpGuestsSection