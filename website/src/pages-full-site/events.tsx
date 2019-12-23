import { useStaticQuery, graphql } from "gatsby"
import React from "react"
import ImageLayout from "../components/layout/ImageLayout"
import SEO from "../components/meta/SEO"
import Authenticated from "../components/partials/Authenticated"
import Schedule from "../components/partials/Schedule"
import PageHeading from "../components/ui/PageHeading"

const EventsPage = () => {
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
    <ImageLayout
      fluidImage={data.heroImage.childImageSharp.fluid}
      objectPosition="50% 5%"
      alt="Picture of Milind and Alisha smiling at the camera in front of a bouquet of roses"
    >
      <SEO title="Events" />
      <PageHeading>Events</PageHeading>
      <Authenticated>
        <Schedule />
      </Authenticated>
    </ImageLayout>
  )
}
export default EventsPage
