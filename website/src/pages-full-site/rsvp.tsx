import React from "react"
import SEO from "../components/meta/SEO"
import Authenticated from "../components/partials/Authenticated"
import { useStaticQuery, graphql } from "gatsby"
import ImageLayout from "../components/layout/ImageLayout"
import RsvpSection from "../components/partials/RsvpSection"
import { DeadlinesResult } from "../interfaces/Event"

const RsvpPage = () => {
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
          ...Deadlines
        }
      }
    `
  )
  const site = data.site as DeadlinesResult

  return (
    <ImageLayout fluidImage={data.heroImage.childImageSharp.fluid}>
      <SEO title="RSVP" />
      <section className="max-w-lg mx-auto">
        <h1 className="c-page-heading text-center">RSVP</h1>
        <Authenticated>
          <div>
            <div className="mb-4">
              <p className="c-body-text">
                We hope to see you at our wedding! Please RSVP by{" "}
                <span className="font-semibold">
                  {site.siteMetadata.deadline}
                </span>
                .
              </p>
              <p className="c-body-text">
                Any member of your party can submit for the whole group, and you
                can edit your RSVP as many times as you like before{" "}
                {site.siteMetadata.shortDeadline}.
              </p>
            </div>
            <RsvpSection />
          </div>
        </Authenticated>
      </section>
    </ImageLayout>
  )
}
export default RsvpPage
