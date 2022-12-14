import { graphql, useStaticQuery } from "gatsby"
import BackgroundImage from "gatsby-background-image"
import { getImage } from "gatsby-plugin-image"
import { convertToBgImage } from "gbimage-bridge"
import React from "react"
import BaseLayout from "../components/layout/BaseLayout"
import SEO from "../components/meta/SEO"

const IndexPage = () => {
  const imageData = useStaticQuery(
    graphql`
      query {
        heroImage: file(relativePath: { eq: "main-hero-large.jpg" }) {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH, quality: 95)
          }
        }
      }
    `
  )
  const bgImage = convertToBgImage(getImage(imageData.heroImage))
  return (
    <BaseLayout>
      <h1 className="sr-only">Alisha &amp; Milind Wedding</h1>
      <SEO
        title="Home"
        image="/meta-main-hero.jpg"
        description="Due to the COVID-19 pandemic, we have decided to cancel our planned wedding celebrations in October. We&rsquo;re still figuring out our next steps, and we hope to celebrate in person with you some day soon!"
      />
      <main>
        <BackgroundImage className="min-h-screen" {...bgImage}>
          <div className="min-h-screen flex justify-center items-center">
            <div className="p-6 font-serif text-lg bg-background-night bg-opacity-75 text-primary-night sm:mx-auto sm:max-w-sm sm:rounded-md sm:bg-opacity-50">
              <p>
                Dear family and friends,
                <br />
                <br />
                Due to the COVID-19 pandemic, we have decided to cancel our
                planned wedding celebrations in October. We&rsquo;re still
                figuring out our next steps, and we hope to celebrate in person
                with you some day soon.
                <br />
                <br />
                Stay safe!
                <br />
                <br />
                Love,
                <br />
                Alisha &amp; Milind
              </p>
            </div>
          </div>
        </BackgroundImage>
      </main>
    </BaseLayout>
  )
}
export default IndexPage
