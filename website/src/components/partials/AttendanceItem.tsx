import React, { useMemo } from "react"
import OptionsGroup from "../form/OptionsGroup"
import { WeddingEvent } from "../../interfaces/Event"
import ControlledLabelledOption from "../form/ControlledLabelledOption"
import { GuestMap } from "../../interfaces/RsvpFormValues"
import { filterNonEmptyKeys } from "../utils/Utils"
import { useUID } from "react-uid"

interface AttendanceItemProps {
  event: WeddingEvent
  guests: GuestMap
}

const AttendanceItem: React.FC<AttendanceItemProps> = ({ event, guests }) => {
  const options = useMemo(
    () =>
      filterNonEmptyKeys(guests).map(id => ({
        value: id,
        label: guests[id],
      })),
    [guests]
  )
  const numOptions = options.length
  const headingId = useUID()

  return numOptions === 0 ? null : numOptions === 1 ? (
    <ControlledLabelledOption
      type="checkbox"
      name={`attendees.${event.shortName}`}
      label={`${event.name} @ ${event.shortDate}`}
      value={options[0].value}
    />
  ) : (
    <div className="mt-4">
      <p className="font-semibold -mb-1" id={headingId}>
        {event.name}
        <span className="text-gray-600"> @ {event.shortDate}</span>
      </p>
      <OptionsGroup
        name={`attendees.${event.shortName}`}
        type="checkbox"
        label="Who is attending?"
        options={options}
        additionalGroupLabelId={headingId}
        showSelectAll
        selectAllLabel={numOptions > 2 ? "All guests" : "Both guests"}
      />
    </div>
  )
}
export default AttendanceItem
