export interface WeddingEventMarkdown {
  html: string
  frontmatter: {
    shortName: string
    name: string
    shortDate: string
    startDate: string
    endDate: string
    longDateOnly: string
    timeOnly: string
    endTimeOnly: string
    location: string
    preEvent: boolean
    attire: string
    plainText: string
    subLocations?: {
      name: string
      location: string
      time: string
    }[]
  }
}
