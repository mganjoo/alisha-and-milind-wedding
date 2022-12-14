import classnames from "classnames"
import { useFormikContext } from "formik"
import React, { useContext } from "react"
import { RsvpFormValues } from "../../../interfaces/RsvpFormValues"
import LabelledTextField from "../../form/LabelledTextField"
import OptionsGroup from "../../form/OptionsGroup"
import SingleCheckbox from "../../form/SingleCheckbox"
import TextInputGroup from "../../form/TextInputGroup"
import { InvitationContext } from "../Authenticated"
import { section_heading, section_subheading } from "./RsvpForm.module.css"

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

const RsvpGuestsSection = React.forwardRef<HTMLHeadingElement>(
  (_props, ref) => {
    const { invitation } = useContext(InvitationContext)
    const { values } = useFormikContext<RsvpFormValues>()
    const guestKeys = Object.keys(values.guests)

    return (
      <section
        aria-labelledby={classnames("guests-heading-1", {
          "guests-heading-2": invitation.numGuests > 1,
        })}
        aria-describedby="guests-description"
      >
        <h2
          className={
            invitation.numGuests === 1 ? section_heading : section_subheading
          }
          ref={ref}
          id="guests-heading-1"
        >
          {invitation.latestRsvp ? "Editing RSVP" : "Welcome"}
        </h2>
        {invitation.numGuests > 1 && (
          <h3 className={section_heading} id="guests-heading-2">
            {invitation.partyName}
          </h3>
        )}
        <p className="c-form-description" id="guests-description">
          {invitation.latestRsvp ? (
            <>
              Here is the information from your previous submission. Feel free
              to make changes and submit the RSVP again.
            </>
          ) : (
            <>
              {guestKeys.length > 1 ? (
                <>
                  Please correct any name as needed. Any member of your party
                  can submit for the whole group, and you
                </>
              ) : (
                <>Please confirm the spelling of your name. You</>
              )}{" "}
              can always come back and edit your RSVP even after you&rsquo;ve
              submitted.
            </>
          )}
        </p>
        <TextInputGroup
          label={guestKeys.length > 1 ? "Names of guests" : "Name"}
          groupName="guests"
          fieldKeys={guestKeys}
          fieldLabelFn={(i) => `Name of ${ordinalSuffix(i)} guest`}
        />
        <OptionsGroup
          name="attending"
          type="radio"
          label="Will you be attending?"
          options={attendingOptions}
        />
        {values.attending === "yes" && (
          <SingleCheckbox
            name="declaration"
            groupLabel="COVID acknowledgment"
            disabled={values.attending !== "yes"}
            optionLabel={
              `${invitation.numGuests > 1 ? "We" : "I"} understand that ${
                invitation.numGuests > 1 ? "we" : "I"
              } must be fully ` +
              `vaccinated or have a negative COVID test within 48 hours of attending ` +
              `the wedding, and ${
                invitation.numGuests > 1 ? "are" : "am"
              } willing to provide verification.`
            }
          />
        )}
        <LabelledTextField
          name="comments"
          type="textarea"
          rows={3}
          label="Comments and song requests (optional)"
          placeholder="Any comments or questions for us? Feel free to drop any song requests for our DJ here!"
        />
      </section>
    )
  }
)

export default RsvpGuestsSection
