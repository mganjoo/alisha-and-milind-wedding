import React, { useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"
import SEO from "../components/meta/SEO"
import BaseLayout from "../components/layout/BaseLayout"
import AddToCalendarLinks from "../components/ui/AddToCalendarLinks"
import classnames from "classnames"
import SaveTheDateForm from "../components/save-the-date/SaveTheDateForm"

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
            siteUrl
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
            <div aria-hidden="true">
              <svg
                className="inline-block text-gray-600 stroke-current"
                width="70"
                height="28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M54.843 10.9c-3.615 2.051-6.843 3.81-9.798 5.273m9.798-5.272C56.666 1 68.99 3.516 68.99 3.516s.437 4.194-4.456 5.452c-4.894 1.258-4.894-.42-9.69 1.933zm0 0s3.522-4.869 6.922-4.45M1 6.452c5.78 5.347 6.834 5.94 14.025 9.355m30.02.367c.995 9.569 13.994 3.522 16.295 2.02-4.258-2.622-9.556-.245-16.295-2.02zm0 0c2.903-5.16 2.886-11.09 0-15.173-2.888 4.439-2.91 10.371 0 15.173zm0 0c-5.86 1.578-10.748 2.29-15.155 2.16m0 0c.238-.27 10.2 2.796 5.525 8.667-1.7-1.677-7.65-4.613-5.525-8.666zm0 0c4.138-3.668 4.452-8.55 1.7-11.881-2.183 4.265-2.595 6.857-1.7 11.882zm0 0c-3.353-.097-10.249-1.333-14.865-2.527m0 0c2.574 3.195 4.386 3.486 2.125 8.678-2.91-4.533-4.308-4.42-2.125-8.678zm0 0c6.161-2.433 5.466-6.73 6.375-6.838 2.586 5.077.425 6.838-6.375 6.838z" />
              </svg>
            </div>
            <p className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">
              Alisha &amp; Milind
            </p>
            <p className="mt-2 font-serif text-xl sm:text-2xl">
              May 1 &amp; 2, 2020
            </p>
            <p className="font-serif text-lg sm:text-xl">San Mateo, CA</p>
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
                    location: "San Mateo, CA",
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
