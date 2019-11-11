import React, { useContext, useState } from "react"
import { InvitationContext } from "./Authenticated"
import { makeIdMap, range } from "../utils/Utils"
import BaseForm from "../form/BaseForm"
import { Formik, useFormikContext } from "formik"
import SubmitButton from "../form/SubmitButton"
import OptionsGroup from "../form/OptionsGroup"
import TextInputGroup from "../form/TextInputGroup"
import { useStaticQuery, graphql } from "gatsby"
import { Event, EventResult } from "../../interfaces/Event"
import LabelledOption from "../form/LabelledOption"
import { object, string } from "yup"

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
  { value: "no", label: "No, we'll celebrate from afar." },
]

function filterNonEmptyKeys(obj: { [key: string]: string }): string[] {
  return Object.keys(obj).filter(id => obj[id] && !/^\s*$/.test(obj[id]))
}

interface EventAttendanceProps {
  event: Event
  guests: { [id: string]: string }
}
const EventAttendance: React.FC<EventAttendanceProps> = ({ event, guests }) => {
  const numGuests = Object.keys(guests).length
  return numGuests === 0 ? null : numGuests === 1 ? (
    <LabelledOption
      type="checkbox"
      name={`attendees.${event.shortName}`}
      label={`${event.name} @ ${event.shortDate}`}
      value={guests[Object.keys(guests)[0]]}
    />
  ) : (
    <div>
      <p className="mt-6 font-semibold">
        {event.name}
        <span className="text-gray-600"> @ {event.shortDate}</span>
      </p>
      <OptionsGroup
        name={`attendees.${event.shortName}`}
        type="checkbox"
        label="Who is attending?"
        options={Object.keys(guests).map(id => ({
          value: id,
          label: guests[id],
        }))}
      />
    </div>
  )
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
  const nonEmptyGuestKeys = filterNonEmptyKeys(values.guests)
  const nonEmptyGuests = nonEmptyGuestKeys.reduce(
    (obj, key) => {
      obj[key] = values.guests[key]
      return obj
    },
    {} as { [key: string]: string }
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
  const initialValues: RsvpFormValues = {
    guests: initialGuests,
    attending: "",
    attendees: {
      sangeet: [],
      ceremony: [],
      reception: [],
    },
  }
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
      <BaseForm className="font-serif max-w-xs w-full">
        <TextInputGroup
          label="Names of guests"
          errorKey="guests"
          fieldNames={Object.keys(initialGuests).map(id => `guests.${id}`)}
          fieldLabelFn={i => `Enter name of guest ${i}`}
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
