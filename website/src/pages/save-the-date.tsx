import React, { useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"
import SEO from "../components/meta/SEO"
import BaseLayout from "../components/layout/BaseLayout"
import AddToCalendarLinks from "../components/ui/AddToCalendarLinks"
import classnames from "classnames"
import SaveTheDateForm from "../components/partials/SaveTheDateForm"
import LeafSpacer from "../components/ui/LeafSpacer"

export default function SaveTheDatePage() {
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
            siteUrl
            location
          }
        }
      }
    `
  )
  const [submitted, setSubmitted] = useState(false)

  return (
    <BaseLayout>
      <SEO
        title="Save the Date"
        image="/alisha-and-milind-mirror.jpg"
        description="Please save the date for Alisha & Milind's wedding: May 1 & 2, 2020 in San Mateo, CA."
      />
      <main className="lg:flex lg:flex-row-reverse">
        <Img
          className="save-the-date-banner flex-1"
          fluid={data.weddingHeroImage.childImageSharp.fluid}
          backgroundColor="#ece5df"
          alt=""
          imgStyle={{ objectPosition: "36% 50%" }}
        />
        <div className="flex-none flex flex-col items-center mx-auto max-w-lg lg:max-w-lg">
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
            className="my-8 inline-block w-24 border-gray-400"
            aria-hidden="true"
          />
          <section
            className="relative"
            aria-label="Confirm contact details"
            aria-describedby="save-the-date-instructions"
          >
            <div
              className={classnames("c-article px-12 lg:px-16", {
                "hidden lg:block lg:invisible": submitted,
              })}
            >
              <p className="text-center" id="save-the-date-instructions">
                We&apos;re going green! Please confirm your preferred email
                address for the digital invitation to follow.
              </p>
              <SaveTheDateForm onSubmit={() => setSubmitted(true)} />
            </div>
            {submitted && (
              <div
                className="flex flex-col text-center px-8 items-center lg:absolute lg:inset-0 lg:px-12"
                role="status"
              >
                <div className="w-12 h-12 mt-2 mb-6" aria-hidden="true">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    className="fill-current text-green-700"
                  >
                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z" />
                  </svg>
                </div>
                <div className="c-article">
                  <p>
                    Thank you for confirming your email! Stay tuned for the
                    invitation and wedding website.
                  </p>
                  <p>We&apos;re so excited to celebrate with you!</p>
                </div>
                <h2 className="mt-4 mb-2 text-sm font-sans font-semibold">
                  Add dates to calendar
                </h2>
                <AddToCalendarLinks
                  className="max-w-sm pb-4 lg:max-w-full"
                  event={{
                    title: "Alisha & Milind's Wedding Weekend",
                    location: data.site.siteMetadata.location,
                    description: `Save the date for Alisha & Milind's wedding! More details to come at ${data.site.siteMetadata.siteUrl}`,
                    startTime: "2020-05-01T00:00:00-07:00",
                    endTime: "2020-05-03T00:00:00-07:00",
                    allDay: true,
                    url: data.site.siteMetadata.siteUrl,
                  }}
                />
              </div>
            )}
          </section>
        </div>
      </main>
    </BaseLayout>
  )
}
