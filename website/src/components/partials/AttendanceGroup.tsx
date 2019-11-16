import React, { useEffect, useRef, useState } from "react"
import { EventResult } from "../../interfaces/Event"
import { useStaticQuery, graphql } from "gatsby"
import AttendanceItem from "./AttendanceItem"
import { useFormikContext } from "formik"
import { RsvpFormValues } from "../../interfaces/RsvpFormValues"
import Alert from "../form/Alert"

const AttendanceGroup: React.FC = () => {
  const { site }: { site: EventResult } = useStaticQuery(
    graphql`
      query {
        site {
          ...Event
        }
      }
    `
  )
  const { errors, submitCount } = useFormikContext<RsvpFormValues>()
  const prevSubmitCountRef = useRef(submitCount)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    // If attendees field has an error and we just submitted, show an alert
    if (errors.attendees && prevSubmitCountRef.current !== submitCount) {
      prevSubmitCountRef.current = submitCount
      setShowError(true)
    } else if (!errors.attendees) {
      setShowError(false)
    }
  }, [submitCount, errors.attendees])

  return (
    <div>
      {showError && <Alert>{errors.attendees}</Alert>}
      <p className="font-semibold mt-4 text-lg">Confirm events</p>
      <p className="mb-2">
        Please let us know what events you&apos;ll be attending.
      </p>
      {site.siteMetadata.events.map(event => (
        <AttendanceItem key={event.shortName} event={event} />
      ))}
    </div>
  )
}
export default AttendanceGroup
