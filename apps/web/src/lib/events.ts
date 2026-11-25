import { getCollection } from "astro:content"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import type { WeddingEventMarkdown } from "../interfaces/Event"

dayjs.extend(utc)

// Event times are venue wall-clock times; parse and format in UTC so the
// result never depends on the build machine's timezone.
const fmt = (d: string, f: string) => dayjs.utc(d).format(f)

/**
 * All wedding events sorted by start time, in the exact shape the Gatsby
 * GraphQL query produced, so components can be ported unchanged.
 * Serialisable, so it can be passed as props to React islands.
 */
export async function loadEvents(): Promise<WeddingEventMarkdown[]> {
  const entries = await getCollection("events")
  entries.sort((a, b) => a.data.date.localeCompare(b.data.date))
  return Promise.all(
    entries.map(async (entry) => {
      const html = entry.rendered?.html ?? ""
      const d = entry.data
      return {
        html,
        frontmatter: {
          shortName: d.shortName,
          name: d.title,
          shortDate: fmt(d.date, "ddd MMM D, YYYY, h:mm a"),
          longDateOnly: fmt(d.date, "dddd, MMMM D, YYYY"),
          timeOnly: fmt(d.date, "h:mm a"),
          endTimeOnly: fmt(d.endDate, "h:mm a"),
          startDate: fmt(d.date, "YYYY-MM-DDTHH:mm:ss-07:00"),
          endDate: fmt(d.endDate, "YYYY-MM-DDTHH:mm:ss-07:00"),
          location: d.location,
          preEvent: d.preEvent,
          attire: d.attire,
          plainText: d.plainText,
          subLocations: d.subLocations?.map((s) => ({
            name: s.name,
            location: s.location,
            time: fmt(s.date, "h:mm a"),
          })),
        },
      }
    })
  )
}
