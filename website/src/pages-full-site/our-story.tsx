import React from "react"
import SEO from "../components/meta/SEO"
import { useStaticQuery, graphql } from "gatsby"
import ImageLayout from "../components/layout/ImageLayout"
import PageHeading from "../components/ui/PageHeading"
import Emoji from "../components/ui/Emoji"

const OurStoryPage = () => {
  const data = useStaticQuery(
    graphql`
      query {
        heroImage: file(relativePath: { eq: "our-story-hero.jpg" }) {
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
      <SEO title="Our Story" />
      <PageHeading>Our Story</PageHeading>
      <div className="c-article">
        <p>
          When Milind and Alisha met, he was struck by her passion and
          wittiness; she was impressed by his encyclopedic knowledge of obscure
          facts. When they are not debating British vs American grammar rules
          (truly they are 200-year-olds in 20-something-year-old bodies), you
          will find them engrossed in a board game, stumbling through the
          wilderness, or yelling out fruits and woods in a misguided attempt at
          describing wine.
        </p>
        <h2>The Proposal</h2>
        <p>
          Alisha’s friends thought Milind would certainly propose when the
          couple went to see{" "}
          <a href="https://en.wikipedia.org/wiki/Hamilton_(musical)">
            Hamilton
          </a>{" "}
          the musical &mdash; the photo caption would have been “
          <a href="https://www.youtube.com/watch?v=WySzEXKUSZw">
            The Room Where It Happened
          </a>{" "}
          {<Emoji symbol="💎" label="diamond emoji" />}” &mdash; but Milind has
          never been one to take the obvious route. Instead, he patiently waited
          until a few weeks later when Milind and Alisha visited the{" "}
          <a href="https://legionofhonor.famsf.org/">Legion of Honor Museum</a>.
          Alisha, unsuspecting as ever after spending hours underground at a
          mummies exhibit, led Milind straight to the proposal spot so that she
          could take a photo of that VIEW (you know, the one with the Golden
          Gate Bridge). He had smoothly arranged for their friend to already be
          there, incognito, to capture the moment. And well, we know how that
          story ends. {<Emoji symbol="😊" label="smiley face emoji" />}
        </p>
        <p>
          Milind and Alisha could not be more thrilled to celebrate with you
          during their wedding weekend.
        </p>
      </div>
    </ImageLayout>
  )
}
export default OurStoryPage
