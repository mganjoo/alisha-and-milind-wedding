import { graphql } from "gatsby"

export interface WeddingEventMarkdown {
  html: string
  frontmatter: {
    shortName: string
    name: string
    shortDate: string
    preEvent: true
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

export interface DeadlinesResult {
  siteMetadata: {
    shortDeadline: string
    deadline: string
  }
}

export const deadlinesFragment = graphql`
  fragment Deadlines on Site {
    siteMetadata {
      shortDeadline: rsvpDeadline(formatString: "MMMM D")
      deadline: rsvpDeadline(formatString: "MMMM D, YYYY")
    }
  }
`
