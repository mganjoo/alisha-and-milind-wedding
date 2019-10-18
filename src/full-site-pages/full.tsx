import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import Img from "gatsby-image"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"

const IndexPage = () => {
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
          <div className="c-article">
            <p>
              Welcome to our wedding website! We are so excited to celebrate
              this weekend with you!
              <br />
              <br />
              Love,
              <br />
              Alisha &amp; Milind
            </p>
          </div>
          <Link className="shadow-md mt-6 c-button" to="/rsvp">
            RSVP
          </Link>
        </div>
      </div>
    </NavLayout>
  )
}
export default IndexPage
