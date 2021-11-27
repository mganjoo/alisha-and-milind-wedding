import React, { useContext } from "react"
import { WeddingEventMarkdown } from "../../interfaces/Event"
import { WeddingMetadataContext } from "../../utils/WeddingMetadataContext"
import AddToCalendarLinks from "../ui/AddToCalendarLinks"
import ExternalLink from "../ui/ExternalLink"
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
  <span className="flex items-center mx-2 mb-2 font-sans text-sm text-secondary dark:text-secondary-night print:text-primary-print">
    <Symbol symbol={symbol} className="mr-2" size="s" label={label} inline />
    {children}
  </span>
)

function makeDescription(event: WeddingEventMarkdown) {
  const subEventDescription = event.frontmatter.subLocations
    ? event.frontmatter.subLocations
        .map(
          (location) =>
            `* ${location.name}: ${location.location} at ${location.time}`
        )
        .join("\n") + "\n\n"
    : event.frontmatter.location
    ? `Location: ${event.frontmatter.location}\n\n`
    : ""
  return `${subEventDescription}${event.frontmatter.plainText}\nAttire: ${event.frontmatter.attire}`
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ event }) => {
  const metadata = useContext(WeddingMetadataContext)
  const addressLine = metadata
    ? (event.frontmatter.preEvent
        ? metadata.preEventsVenue
        : metadata.mainVenue
      ).join(", ")
    : undefined
  const addressUrl = event.frontmatter.preEvent
    ? metadata?.preEventsVenueUrl
    : metadata?.mainVenueUrl
  return (
    <div className="mb-12 md:flex md:items-center">
      <div className="mb-2 md:mb-0 md:w-2/5 md:flex md:flex-col md:items-center">
        <h2 className="text-heading-primary font-sans text-2xl font-semibold mb-2 dark:text-heading-primary-night print:text-heading-print">
          {event.frontmatter.name}
        </h2>
        <div className="pl-2 border-l border-accent w-full md:pl-0 md:border-0 dark:border-accent-night print:border-subtle">
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
              {event.frontmatter.location || addressLine}
            </ScheduleInfoItem>
          </ScheduleInfoRow>
          <div className="flex py-1 md:justify-center print:hidden">
            <AddToCalendarLinks
              label="Add to calendar"
              event={{
                title: `${event.frontmatter.name}: Alisha and Milind's Wedding`,
                location: addressLine,
                description: makeDescription(event),
                startTime: event.frontmatter.startDate,
                endTime: event.frontmatter.endDate,
                url: addressUrl,
              }}
              dropdown
            />
            {addressUrl && (
              <ExternalLink href={addressUrl} className="c-inline-button">
                Open Map
              </ExternalLink>
            )}
          </div>
        </div>
      </div>
      <div className="md:pl-4 md:py-4 md:w-3/5 md:border-l md:border-accent md:dark:border-accent-night print:border-subtle">
        {event.frontmatter.subLocations && (
          <div className="my-4 md:mt-0">
            {event.frontmatter.subLocations.map((location) => (
              <ScheduleInfoItem
                key={location.name}
                label="Event"
                symbol="location"
              >
                <span>
                  <span className="font-semibold">{location.name}</span>:{" "}
                  {location.location} at {location.time}
                </span>
              </ScheduleInfoItem>
            ))}
          </div>
        )}
        <div
          className="c-body-text-container"
          dangerouslySetInnerHTML={{ __html: event.html }}
        />
        <div className="c-body-text-container -mb-4">
          <p>
            <span className="font-semibold">Attire</span>:{" "}
            {event.frontmatter.attire}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ScheduleItem
