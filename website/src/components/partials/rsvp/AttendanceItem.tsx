import React from "react"
import { WeddingEventMarkdown } from "../../../interfaces/Event"
import OptionsGroup, { Option } from "../../form/OptionsGroup"

interface AttendanceItemProps {
  event: WeddingEventMarkdown
  guestOptions: Option[]
}

const AttendanceItem: React.FC<AttendanceItemProps> = ({
  event,
  guestOptions,
}) => {
  const headingId = `event-heading-${event.frontmatter.shortName}`
  const options =
    guestOptions.length === 1
      ? [{ label: "Attending", value: guestOptions[0].value }]
      : guestOptions

  return (
    <div className="mb-4 sm:flex sm:items-center">
      <p
        className="flex flex-wrap items-baseline pb-1 border-b border-subtle dark:border-subtle-night sm:border-0 sm:mr-4 sm:w-2/5 sm:flex-col sm:items-end sm:pb-0"
        id={headingId}
      >
        <span className="pr-3 text-lg font-sans font-semibold text-heading-primary dark:text-heading-primary-night sm:pr-0 sm:mb-1 sm:text-xl print:text-heading-print">
          {event.frontmatter.name}
        </span>
        <span className="text-secondary text-sm font-serif dark:text-secondary-night sm:text-base">
          {event.frontmatter.shortDate}
        </span>
      </p>
      <div className="mt-2 sm:-mb-4 sm:w-3/5 sm:mt-0">
        <OptionsGroup
          name={`attendees.${event.frontmatter.shortName}`}
          type="checkbox"
          label={`${event.frontmatter.name} @ ${event.frontmatter.shortDate}`}
          labelType="aria"
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
