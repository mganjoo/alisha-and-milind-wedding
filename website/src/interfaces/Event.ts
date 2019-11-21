import { graphql } from "gatsby"

export interface WeddingEvent {
  shortName: string
  name: string
  shortDate: string
  preEvent: true
}

export interface EventResult {
  siteMetadata: {
    events: WeddingEvent[]
  }
}

export const eventFragment = graphql`
  fragment Event on Site {
    siteMetadata {
      events {
        shortName
        name
        shortDate: date(formatString: "ddd MMM D, h:mma")
        preEvent
      }
    }
  }
`