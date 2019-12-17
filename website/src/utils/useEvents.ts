import { EventResultMarkdown } from "../interfaces/Event"
import { useStaticQuery, graphql } from "gatsby"

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
              shortDate: date(formatString: "ddd MMM D, h:mma")
              longDateOnly: date(formatString: "dddd, MMMM D")
              timeOnly: date(formatString: "h:mma")
              startDate: date(formatString: "YYYY-MM-DDTHH:mm:ss-07:00")
              endDate: endDate(formatString: "YYYY-MM-DDTHH:mm:ss-07:00")
              preEvent
              shortName
              name: title
              location
            }
          }
        }
      }
    }
  `)
  return allMarkdownRemark.edges.map(e => e.node)
}
