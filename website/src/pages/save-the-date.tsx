import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"
import SEO from "../components/meta/SEO"
import BaseLayout from "../components/layout/BaseLayout"
import SaveTheDateForm from "../components/partials/SaveTheDateForm"
import LeafSpacer from "../components/ui/LeafSpacer"

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
        image="/alisha-and-milind-mirror.jpg"
        description="Please save the date for Alisha & Milind's wedding: May 1 & 2, 2020 in San Mateo, CA."
      />
      <main className="lg:flex lg:flex-row-reverse">
        <Img
          className="full-screen-hero flex-1"
          fluid={data.weddingHeroImage.childImageSharp.fluid}
          backgroundColor="#ece5df"
          alt=""
          imgStyle={{ objectPosition: "36% 50%" }}
        />
        <div className="flex-none flex flex-col items-center mx-auto max-w-md px-8">
          <section className="text-center">
            <h1 className="mt-4 font-script text-4xl text-orange-900 sm:text-5xl lg:mt-10">
              Save the Date
            </h1>
            <LeafSpacer />
            <p className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">
              {data.site.siteMetadata.displayTitle}
            </p>
            <p className="mt-2 font-serif text-xl sm:text-2xl">
              {data.site.siteMetadata.displayDates}
            </p>
            <p className="font-serif text-lg sm:text-xl">
              {data.site.siteMetadata.location}
            </p>
          </section>
          <hr
            className="my-8 inline-block w-24 border-subtle-gray"
            aria-hidden="true"
          />
          <section
            className="relative"
            aria-label="Confirm contact details"
            aria-describedby="save-the-date-instructions"
          >
            <SaveTheDateForm />
          </section>
        </div>
      </main>
    </BaseLayout>
  )
}
export default SaveTheDatePage
