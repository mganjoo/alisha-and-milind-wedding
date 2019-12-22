import React from "react"
import SEO from "../components/meta/SEO"
import { useStaticQuery, graphql } from "gatsby"
import ImageLayout from "../components/layout/ImageLayout"
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
    <ImageLayout fluidImage={data.heroImage.childImageSharp.fluid}>
      <SEO title="Travel" />
      <PageHeading>Travel</PageHeading>
      <p>TODO</p>
    </ImageLayout>
  )
}
export default TravelPage
