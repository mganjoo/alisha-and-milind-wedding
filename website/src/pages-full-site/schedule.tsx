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
        heroImage: file(relativePath: { eq: "events-hero.jpg" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `
  )
  return (
    <NavLayout
      heroImage={data.heroImage.childImageSharp.fluid}
      heroBackground="#F7E2AD"
      objectPosition="50% 5%"
      alt="Picture of Milind and Alisha smiling at the camera in front of a bouquet of roses"
    >
      <SEO title="Events" />
      <PageHeading>Schedule</PageHeading>
      <Authenticated>
        <Schedule />
      </Authenticated>
    </NavLayout>
  )
}
export default SchedulePage
