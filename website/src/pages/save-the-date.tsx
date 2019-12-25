import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"
import React from "react"
import BaseLayout from "../components/layout/BaseLayout"
import SEO from "../components/meta/SEO"
import SaveTheDateForm from "../components/partials/SaveTheDateForm"
import LeafSpacer from "../components/ui/LeafSpacer"
import "../components/partials/SaveTheDate.module.css"

const SaveTheDatePage: React.FC = () => {
  const data = useStaticQuery(
    graphql`
      query {
        weddingHeroImage: file(relativePath: { eq: "save-the-date-hero.jpg" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
        site {
          siteMetadata {
            displayTitle
            displayDates
            location
          }
        }
      }
    `
  )

  return (
    <BaseLayout>
      <SEO
        title="Save the Date"
        image="/meta-save-the-date-hero.jpg"
        description="Please save the date for Alisha & Milind's wedding: May 1 & 2, 2020 in San Mateo, CA."
      />
      <main className="lg:flex lg:flex-row-reverse">
        <Img
          className="flex-1 p-cover"
          // @ts-ignore styleName not supported on Gatsby image
          styleName="hero"
          fluid={data.weddingHeroImage.childImageSharp.fluid}
          backgroundColor="#ece5df"
          alt="Selfie of Milind and Alisha taken in a car side mirror"
          imgStyle={{ objectPosition: "36% 50%" }}
        />
        <section
          className="flex-none flex flex-col items-center mx-auto max-w-md px-8 py-6 lg:py-10"
          aria-labelledby="save-the-date-heading save-the-date-names"
        >
          <h1
            className="font-script text-4xl text-orange-900 text-center sm:text-5xl"
            id="save-the-date-heading"
          >
            Save the Date
          </h1>
          <LeafSpacer />
          <h2
            className="mb-2 font-display text-3xl tracking-wide text-center sm:text-4xl"
            id="save-the-date-names"
          >
            {data.site.siteMetadata.displayTitle}
          </h2>
          <h3 className="font-serif text-xl text-center sm:text-2xl">
            {data.site.siteMetadata.displayDates}
          </h3>
          <h3 className="font-serif text-lg text-center sm:text-xl">
            {data.site.siteMetadata.location}
          </h3>
          <hr
            className="my-8 inline-block w-24 border-subtle-gray"
            aria-hidden
          />
          <SaveTheDateForm />
        </section>
      </main>
    </BaseLayout>
  )
}
export default SaveTheDatePage
