import React, { useContext } from "react"
import { WeddingEventMarkdown } from "../../interfaces/Event"
import Symbol from "../ui/Symbol"
import AddToCalendarLinks from "../ui/AddToCalendarLinks"
import { WeddingMetadataContext } from "../../utils/WeddingMetadataContext"

interface ScheduleItemProps {
  event: WeddingEventMarkdown
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ event }) => {
  const metadata = useContext(WeddingMetadataContext)
  return (
    <div className="mb-12 md:flex md:items-center">
      <div className="mb-3 md:mb-0 md:w-1/2 md:flex md:flex-col md:items-center">
        <h2 className="text-orange-800 font-sans text-2xl font-semibold mb-3">
          {event.frontmatter.name}
        </h2>
        <div className="pl-2 font-sans text-gray-700 border-l border-orange-500 w-full md:pl-0 md:border-0">
          <div className="flex flex-wrap items-center mb-3 md:justify-center">
            <span className="flex items-center mx-2 mb-2">
              <Symbol
                symbol="calendar"
                className="mr-2"
                svgClassName="w-3"
                label="Date"
                inline
              />
              {event.frontmatter.longDateOnly}
            </span>
            <span className="flex items-center mx-2 mb-2">
              <Symbol
                symbol="time"
                className="mr-2"
                svgClassName="w-3"
                label="Time"
                inline
              />
              {event.frontmatter.timeOnly}
            </span>
            <span className="flex items-center mx-2 w-full md:justify-center">
              <Symbol
                symbol="location"
                className="mr-2"
                svgClassName="w-3"
                label="Venue"
                inline
              />
              {event.frontmatter.location}
            </span>
          </div>
          <div className="flex md:justify-center">
            <AddToCalendarLinks
              label="Add to calendar"
              event={{
                title: `${event.frontmatter.name}: Alisha & Milind's Wedding`,
                location: event.frontmatter.location,
                description: event.plainText,
                startTime: event.frontmatter.startDate,
                endTime: event.frontmatter.endDate,
                url: metadata.siteUrl,
              }}
              dropdown
            />
          </div>
        </div>
      </div>
      <div
        className="c-article -mb-4 md:pl-4 md:pt-4 md:w-1/2 md:border-l md:border-orange-500"
        dangerouslySetInnerHTML={{ __html: event.html }}
      />
    </div>
  )
}

export default ScheduleItem
