import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"
import NavLayout from "../../components/NavLayout"
import SEO from "../../components/seo"

const IndexPage = ({ data }) => {
  const imageData = useStaticQuery(
    graphql`
      query {
        weddingHeroImage: file(relativePath: { eq: "wedding-hero.jpg" }) {
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
    <NavLayout>
      <SEO title="Home" />
      <div className="text-lg leading-tight sm:text-xl md:flex md:px-4 lg:text-2xl">
        <Img
          fluid={imageData.weddingHeroImage.childImageSharp.fluid}
          alt="Picture of wedding"
          className="mb-8 shadow-md md:mb-0 md:shadow-none md:w-3/5"
        />
        <div className="px-10 flex flex-col items-center md:items-start md:w-2/5">
          <p>
            Welcome to our wedding website! We are so excited to celebrate this
            weekend with you!
            <br />
            <br />
            Love,
            <br />
            Alisha & Milind
          </p>
          <button className="button shadow-md mt-12">RSVP</button>
        </div>
      </div>
    </NavLayout>
  )
}
export default IndexPage
