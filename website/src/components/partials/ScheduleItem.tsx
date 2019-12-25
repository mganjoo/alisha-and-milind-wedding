import React, { useContext } from "react"
import { WeddingEventMarkdown } from "../../interfaces/Event"
import { WeddingMetadataContext } from "../../utils/WeddingMetadataContext"
import AddToCalendarLinks from "../ui/AddToCalendarLinks"
import Symbol, { SymbolName } from "../ui/Symbol"

interface ScheduleItemProps {
  event: WeddingEventMarkdown
}

const ScheduleInfoRow: React.FC = ({ children }) => (
  <div className="flex flex-wrap items-center md:justify-center">
    {children}
  </div>
)

interface ScheduleInfoItemProps {
  symbol: SymbolName
  label: string
}

const ScheduleInfoItem: React.FC<ScheduleInfoItemProps> = ({
  children,
  symbol,
  label,
}) => (
  <span className="flex items-center mx-2 mb-2 font-sans text-gray-700">
    <Symbol symbol={symbol} className="mr-2" size="s" label={label} inline />
    {children}
  </span>
)

const ScheduleItem: React.FC<ScheduleItemProps> = ({ event }) => {
  const metadata = useContext(WeddingMetadataContext)
  return (
    <div className="mb-12 md:flex md:items-center">
      <div className="mb-2 md:mb-0 md:w-2/5 md:flex md:flex-col md:items-center">
        <h2 className="text-orange-800 font-sans text-2xl font-semibold mb-2">
          {event.frontmatter.name}
        </h2>
        <div className="pl-2 border-l border-orange-500 w-full md:pl-0 md:border-0">
          <ScheduleInfoRow>
            <ScheduleInfoItem label="Date" symbol="calendar">
              {event.frontmatter.longDateOnly}
            </ScheduleInfoItem>
            <ScheduleInfoItem label="Time" symbol="time">
              {event.frontmatter.timeOnly}
            </ScheduleInfoItem>
          </ScheduleInfoRow>
          <ScheduleInfoRow>
            <ScheduleInfoItem label="Venue" symbol="location">
              {event.frontmatter.location}
            </ScheduleInfoItem>
          </ScheduleInfoRow>
          <div className="flex py-1 md:justify-center">
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
            <a href={event.frontmatter.locationUrl} className="c-inline-button">
              Open Map
            </a>
          </div>
        </div>
      </div>
      <div className="md:pl-4 md:py-4 md:w-3/5 md:border-l md:border-orange-500">
        {event.frontmatter.subLocations && (
          <div className="my-4 md:mt-0">
            {event.frontmatter.subLocations.map(location => (
              <ScheduleInfoItem
                key={location.name}
                label="Event"
                symbol="location"
              >
                {location.name}: {location.location} at {location.time}
              </ScheduleInfoItem>
            ))}
          </div>
        )}
        <div
          className="c-body-text-container -mb-4"
          dangerouslySetInnerHTML={{ __html: event.html }}
        />
      </div>
    </div>
  )
}

export default ScheduleItem
