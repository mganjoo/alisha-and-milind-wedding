import type { WeddingEventMarkdown } from "../../interfaces/Event"
import Authenticated from "./Authenticated"
import Schedule from "./Schedule"

/** Island for the gated part of /schedule. */
const SchedulePage = ({ events }: { events: WeddingEventMarkdown[] }) => (
  <Authenticated>
    <Schedule events={events} />
  </Authenticated>
)

export default SchedulePage
