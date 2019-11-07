import React, { useContext, useMemo } from "react"
import { InvitationContext } from "./Authenticated"
import { makeIdMap, range, createSubmitFunction } from "../utils/Utils"
import BaseForm from "../form/BaseForm"
import { Formik, useFormikContext } from "formik"
import LabelledTextInput from "../form/LabelledTextInput"
import SubmitButton from "../form/SubmitButton"
import OptionsGroup from "../form/OptionsGroup"

interface RsvpFormValues {
  guests: { [key: string]: string }
  attending: string
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

interface AttendanceCheckboxGroupProps {
  name: string
}
const AttendanceCheckboxGroup: React.FC<AttendanceCheckboxGroupProps> = ({
  name,
}) => {
  const { values } = useFormikContext<RsvpFormValues>()
  return (
    <OptionsGroup
      name={name}
      type="checkbox"
      label="Who is attending?"
      options={Object.keys(values.guests)
        .filter(id => values.guests[id] && !/^\s*$/.test(values.guests[id]))
        .map(id => ({
          value: id,
          label: values.guests[id],
        }))}
    />
  )
}

const RsvpForm: React.FC = () => {
  const invitation = useContext(InvitationContext)
  const initialGuests = useMemo(
    () =>
      makeIdMap(range(invitation.numGuests), (i: number) =>
        i < invitation.knownGuests.length ? invitation.knownGuests[i] : ""
      ),
    [invitation]
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
      onSubmit={createSubmitFunction(async values => {
        console.log(values)
      })}
    >
      <BaseForm className="font-serif">
        <div>
          {Object.keys(initialGuests).map((id, i) => (
            <LabelledTextInput
              key={id}
              name={`guests.${id}`}
              label={`Guest ${i + 1}`}
              type="text"
            />
          ))}
        </div>
        <OptionsGroup
          name="attending"
          type="radio"
          label="Will you be attending?"
          options={attendingOptions}
        />
        <div>
          <p className="font-semibold mt-6">Attendance details</p>
          <p>Please let us know what events your party is attending.</p>
          <h2 className="font-semibold mt-2">Sangeet</h2>
          <AttendanceCheckboxGroup name="attendees.sangeet" />
          <AttendanceCheckboxGroup name="attendees.ceremony" />
          <AttendanceCheckboxGroup name="attendees.reception" />
        </div>
        <div className="mt-6">
          <SubmitButton label="Submit" />
        </div>
      </BaseForm>
    </Formik>
  )
}
export default RsvpForm
