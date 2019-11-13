import React, { useContext, useState, useMemo } from "react"
import { InvitationContext } from "./Authenticated"
import { makeIdMap, range } from "../utils/Utils"
import BaseForm from "../form/BaseForm"
import { Formik, useFormikContext } from "formik"
import SubmitButton from "../form/SubmitButton"
import OptionsGroup from "../form/OptionsGroup"
import TextInputGroup from "../form/TextInputGroup"
import { useStaticQuery, graphql } from "gatsby"
import { EventResult } from "../../interfaces/Event"
import { object, string } from "yup"
import EventAttendance from "./EventAttendance"

interface RsvpFormValues {
  guests: { [key: string]: string }
  attending: "yes" | "no" | ""
  attendees: {
    sangeet: string[]
    ceremony: string[]
    reception: string[]
  }
}

const attendingOptions = [
  { value: "yes", label: "Yes, excited to attend!" },
  { value: "no", label: "No, will celebrate from afar." },
]

function filterNonEmptyKeys(obj: { [key: string]: string }): string[] {
  return Object.keys(obj).filter(id => obj[id] && !/^\s*$/.test(obj[id]))
}

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

const AttendanceDetailsSection: React.FC = () => {
  const { site }: { site: EventResult } = useStaticQuery(
    graphql`
      query {
        site {
          ...Event
        }
      }
    `
  )
  const { values } = useFormikContext<RsvpFormValues>()
  const nonEmptyGuestKeys = useMemo(() => filterNonEmptyKeys(values.guests), [
    values.guests,
  ])
  const nonEmptyGuests = useMemo(
    () =>
      nonEmptyGuestKeys.reduce(
        (obj, key) => {
          obj[key] = values.guests[key]
          return obj
        },
        {} as { [key: string]: string }
      ),
    [nonEmptyGuestKeys, values.guests]
  )

  return (
    <>
      {values.attending === "yes" && nonEmptyGuestKeys.length > 0 && (
        <div>
          <p className="font-semibold mt-6 text-lg">Attendance details</p>
          <p>Please let us know what events you&apos;ll be attending.</p>
          {site.siteMetadata.events.map(event => (
            <EventAttendance
              key={event.shortName}
              event={event}
              guests={nonEmptyGuests}
            />
          ))}
        </div>
      )}
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
      attending: "",
      attendees: {
        sangeet: [],
        ceremony: [],
        reception: [],
      },
    }),
    [initialGuests]
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={object({
        guests: object().test(
          "has-some-guest",
          "Please enter at least one name.",
          value => filterNonEmptyKeys(value).length > 0
        ),
        attending: string().required("Please confirm your attendance."),
      })}
      onSubmit={async values => {
        console.log(values)
      }}
    >
      <BaseForm className="font-serif max-w-xs w-full mb-10">
        <TextInputGroup
          label="Names of guests"
          errorKey="guests"
          fieldNames={Object.keys(initialGuests).map(id => `guests.${id}`)}
          fieldLabelFn={i =>
            `Name of ${ordinalSuffix(i)} guest${
              i >= invitation.knownGuests.length ? " (optional)" : ""
            }`
          }
        />
        <OptionsGroup
          name="attending"
          type="radio"
          label="Will you be attending?"
          options={attendingOptions}
        />
        <AttendanceDetailsSection />
        <div className="mt-6">
          <SubmitButton label="Submit" />
        </div>
      </BaseForm>
    </Formik>
  )
}
export default RsvpForm
