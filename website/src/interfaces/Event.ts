import { graphql } from "gatsby"

export interface Event {
  shortName: string
  name: string
  shortDate: string
}

export interface EventResult {
  siteMetadata: {
    events: Event[]
  }
}

export const eventFragment = graphql`
  fragment Event on Site {
    siteMetadata {
      events {
        shortName
        name
        shortDate
      }
    }
  }
`
