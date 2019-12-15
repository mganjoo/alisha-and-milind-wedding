import React from "react"
import AddToCalendarLinks from "../ui/AddToCalendarLinks"
import { useStaticQuery, graphql } from "gatsby"

const SaveTheDateLinks = () => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            siteUrl
            location
          }
        }
      }
    `
  )
  return (
    <AddToCalendarLinks
      label="Add dates to calendar"
      event={{
        title: "Alisha & Milind's Wedding Weekend",
        location: data.site.siteMetadata.location,
        description: `Save the date for Alisha & Milind's wedding! More details to come at ${data.site.siteMetadata.siteUrl}`,
        startTime: "2020-05-01T00:00:00-07:00",
        endTime: "2020-05-03T00:00:00-07:00",
        allDay: true,
        url: data.site.siteMetadata.siteUrl,
      }}
    />
  )
}

export default SaveTheDateLinks
