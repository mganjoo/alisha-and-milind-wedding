import { graphql, useStaticQuery } from "gatsby"

export interface WeddingEventMarkdown {
  html: string
  plainText: string
  frontmatter: {
    shortName: string
    name: string
    shortDate: string
    startDate: string
    endDate: string
    preEvent: boolean
    tentative: boolean
    longDateOnly: string
    timeOnly: string
    location: string
    attire: string
    subLocations?: {
      name: string
      location: string
      time: string
    }[]
  }
}

interface WeddingEventNode {
  node: WeddingEventMarkdown
}

export interface EventResultMarkdown {
  allMarkdownRemark: {
    edges: WeddingEventNode[]
  }
}

/**
 * Returns all registered wedding events.
 */
export function useEvents() {
  const { allMarkdownRemark }: EventResultMarkdown = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        filter: { fields: { sourceName: { eq: "events" } } }
        sort: { fields: frontmatter___date }
      ) {
        edges {
          node {
            html
            plainText
            frontmatter {
              shortDate: date(formatString: "ddd MMM D, h:mm a")
              longDateOnly: date(formatString: "dddd, MMMM D")
              timeOnly: date(formatString: "h:mm a")
              startDate: date(formatString: "YYYY-MM-DDTHH:mm:ss-07:00")
              endDate: endDate(formatString: "YYYY-MM-DDTHH:mm:ss-07:00")
              preEvent
              tentative
              shortName
              name: title
              location
              attire
              subLocations {
                name
                location
                time: date(formatString: "h:mm a")
              }
            }
          }
        }
      }
    }
  `)
  return allMarkdownRemark.edges.map(e => e.node)
}
