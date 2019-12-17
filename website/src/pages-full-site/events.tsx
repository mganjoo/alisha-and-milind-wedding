import React from "react"
import SEO from "../components/meta/SEO"
import { useStaticQuery, graphql } from "gatsby"
import ImageLayout from "../components/layout/ImageLayout"
import Authenticated from "../components/partials/Authenticated"
import Schedule from "../components/partials/Schedule"

const EventsPage = () => {
  const data = useStaticQuery(
    graphql`
      query {
        heroImage: file(relativePath: { eq: "rsvp-hero.jpg" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
        site {
          siteMetadata {
            siteUrl
          }
        }
      }
    `
  )
  return (
    <ImageLayout fluidImage={data.heroImage.childImageSharp.fluid}>
      <SEO title="Events" />
      <h1 className="c-page-heading text-center">Events</h1>
      <Authenticated>
        <Schedule siteUrl={data.site.siteMetadata.siteUrl} />
      </Authenticated>
    </ImageLayout>
  )
}
export default EventsPage
