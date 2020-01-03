import { useStaticQuery, graphql } from "gatsby"
import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import Authenticated from "../components/partials/Authenticated"
import Schedule from "../components/partials/Schedule"
import PageHeading from "../components/ui/PageHeading"

const SchedulePage = () => {
  const data = useStaticQuery(
    graphql`
      query {
        heroImage: file(relativePath: { eq: "schedule-hero.jpg" }) {
          childImageSharp {
            ...HeroImage
          }
        }
      }
    `
  )
  return (
    <NavLayout
      heroImage={data.heroImage.childImageSharp.fluid}
      alt="Picture of Alisha and Milind laughing at the camera"
    >
      <SEO
        title="Events"
        image="/meta-schedule-hero.jpg"
        description="Schedule of events for the wedding."
      />
      <PageHeading>Schedule</PageHeading>
      <Authenticated>
        <Schedule />
      </Authenticated>
    </NavLayout>
  )
}
export default SchedulePage
