import React, { useMemo } from "react"
import OptionsGroup from "../form/OptionsGroup"
import { Event } from "../../interfaces/Event"
import ControlledLabelledOption from "../form/ControlledLabelledOption"

interface EventAttendanceProps {
  event: Event
  guests: { [id: string]: string }
}

const EventAttendance: React.FC<EventAttendanceProps> = ({ event, guests }) => {
  const options = useMemo(
    () =>
      Object.keys(guests).map(id => ({
        value: id,
        label: guests[id],
      })),
    [guests]
  )
  const numGuests = options.length

  return numGuests === 0 ? null : numGuests === 1 ? (
    <ControlledLabelledOption
      type="checkbox"
      name={`attendees.${event.shortName}`}
      label={`${event.name} @ ${event.shortDate}`}
      value={Object.keys(guests)[0]}
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
        options={options}
        showSelectAll
        selectAllLabel={numGuests > 2 ? "All guests" : "Both guests"}
      />
    </div>
  )
}
export default EventAttendance
