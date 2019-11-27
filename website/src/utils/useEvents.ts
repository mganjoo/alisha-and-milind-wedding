import { EventResult } from "../interfaces/Event"
import { useStaticQuery, graphql } from "gatsby"
/**
 * Returns all registered wedding events.
 */
export function useEvents() {
  const {
    site,
  }: {
    site: EventResult
  } = useStaticQuery(graphql`
    query {
      site {
        ...Event
      }
    }
  `)
  return site.siteMetadata.events
}
