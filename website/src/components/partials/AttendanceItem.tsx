import React from "react"
import { WeddingEvent } from "../../interfaces/Event"
import OptionsGroup, { Option } from "../form/OptionsGroup"

interface AttendanceItemProps {
  event: WeddingEvent
  guestOptions: Option[]
}

const AttendanceItem: React.FC<AttendanceItemProps> = ({
  event,
  guestOptions,
}) => {
  const headingId = `event-heading-${event.shortName}`
  const options =
    guestOptions.length === 1
      ? [{ label: "Attending", value: guestOptions[0].value }]
      : guestOptions

  return (
    <div className="mb-2 sm:flex sm:items-center">
      <p
        className="flex flex-wrap items-baseline pb-1 border-b c-subtle-border sm:border-0 sm:mr-4 sm:w-2/5 sm:flex-col sm:items-end sm:pb-0"
        id={headingId}
      >
        <span className="pr-3 text-lg font-sans font-semibold text-orange-800 font-sans sm:pr-0 sm:mb-1 sm:text-xl">
          {event.name}
        </span>
        <span className="text-gray-700 text-sm font-serif sm:text-base sm:mb-6">
          {event.shortDate}
        </span>
      </p>
      <div className="mt-2 sm:w-3/5 sm:mt-0">
        <OptionsGroup
          name={`attendees.${event.shortName}`}
          type="checkbox"
          label={headingId}
          labelType="id"
          options={options}
          showSelectAll={options.length > 1}
          selectAllLabel={`${
            guestOptions.length > 2 ? "All guests" : "Both guests"
          } are attending`}
        />
      </div>
    </div>
  )
}
export default AttendanceItem
