import React, { useContext } from "react"
import { WeddingMetadataContext } from "../../utils/WeddingMetadataContext"
import AddToCalendarLinks from "../ui/AddToCalendarLinks"

const SaveTheDateLinks = () => {
  const data = useContext(WeddingMetadataContext)
  return (
    <AddToCalendarLinks
      label="Add dates to calendar"
      event={{
        title: "Alisha & Milind's Wedding Weekend",
        location: data?.location,
        description: `Save the date for Alisha & Milind's wedding! More details to come at ${data?.siteUrl}`,
        startTime: "2020-05-01T00:00:00-07:00",
        endTime: "2020-05-03T00:00:00-07:00",
        allDay: true,
        url: data?.siteUrl,
      }}
    />
  )
}

export default SaveTheDateLinks
