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
            frontmatter {
              shortDate: date(formatString: "ddd MMM D, h:mma")
              preEvent
              shortName
              name: title
            }
          }
        }
      }
    }
  `)
  return allMarkdownRemark.edges.map(e => e.node)
}
