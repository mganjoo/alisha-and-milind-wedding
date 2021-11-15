import classNames from "classnames"
import { graphql, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import React from "react"
import yn from "yn"
import BaseLayout from "../components/layout/BaseLayout"
import SEO from "../components/meta/SEO"
import {
  hero,
  hero_wrapper,
  main,
} from "../components/partials/SaveTheDate.module.css"
import SaveTheDateForm from "../components/partials/SaveTheDateForm"
import LeafSpacer from "../components/ui/LeafSpacer"

const SaveTheDatePage: React.FC = () => {
  const data = useStaticQuery(
    graphql`
      query {
        weddingHeroImage: file(relativePath: { eq: "save-the-date-hero.jpg" }) {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
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
        description={`Please save the date for Alisha & Milind's wedding: ${data.site.siteMetadata.displayDates} in ${data.site.siteMetadata.location}.`}
      />
      <main className={main}>
        <div className={hero_wrapper}>
          <GatsbyImage
            className={classNames("p-cover", hero)}
            image={data.weddingHeroImage.childImageSharp.gatsbyImageData}
            alt="Selfie of Milind and Alisha taken in a car side mirror"
            imgStyle={{ objectPosition: "36% 50%" }}
          />
        </div>
        <section
          className="flex-none flex flex-col items-center mx-auto max-w-md px-8 py-6"
          aria-labelledby="save-the-date-heading save-the-date-names"
        >
          <h1
            className="font-script text-4xl text-heading-primary text-center dark:text-heading-primary-night lg:text-5xl"
            id="save-the-date-heading"
          >
            Save the Date
          </h1>
          <LeafSpacer />
          <h2
            className="mb-2 font-display text-3xl tracking-wide text-center lg:text-4xl"
            id="save-the-date-names"
          >
            {data.site.siteMetadata.displayTitle}
          </h2>
          <h3 className="font-serif text-xl text-center lg:text-2xl">
            {data.site.siteMetadata.displayDates}
          </h3>
          <h3 className="font-serif text-lg text-center lg:text-xl">
            {data.site.siteMetadata.location}
          </h3>
          <hr
            className="my-8 inline-block w-24 border-subtle dark:border-subtle-night"
            aria-hidden
          />
          <SaveTheDateForm
            redirect={yn(process.env.GATSBY_SAVE_THE_DATE_REDIRECT)}
          />
        </section>
      </main>
    </BaseLayout>
  )
}
export default SaveTheDatePage
