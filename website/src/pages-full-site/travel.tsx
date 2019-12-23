import { useStaticQuery, graphql } from "gatsby"
import React from "react"
import ImageLayout from "../components/layout/ImageLayout"
import SEO from "../components/meta/SEO"
import PageHeading from "../components/ui/PageHeading"

const TravelPage = () => {
  const data = useStaticQuery(
    graphql`
      query {
        heroImage: file(relativePath: { eq: "travel-hero.jpg" }) {
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
      alt="Picture of Alisha pointing at something in the distance and Milind looking on"
    >
      <SEO title="Travel" />
      <PageHeading>Travel</PageHeading>
      <p>TODO</p>
    </ImageLayout>
  )
}
export default TravelPage
