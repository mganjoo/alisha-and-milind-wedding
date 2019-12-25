import { useStaticQuery, graphql } from "gatsby"
import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import Emoji from "../components/ui/Emoji"
import ImageGrid from "../components/ui/ImageGrid"
import PageHeading from "../components/ui/PageHeading"

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
        redRock: file(relativePath: { eq: "our-story-travel-red-rock.jpg" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
        tahoe: file(relativePath: { eq: "our-story-travel-tahoe.jpg" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
        edinburgh: file(
          relativePath: { eq: "our-story-travel-edinburgh.jpg" }
        ) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
        yosemite: file(relativePath: { eq: "our-story-travel-yosemite.jpg" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
        chicago: file(relativePath: { eq: "our-story-travel-chicago.jpg" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
        halloween: file(
          relativePath: { eq: "our-story-travel-halloween.jpg" }
        ) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
        proposal1: file(relativePath: { eq: "our-story-proposal-1.jpg" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
        proposal2: file(relativePath: { eq: "our-story-proposal-2.jpg" }) {
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
    <NavLayout
      heroImage={data.heroImage.childImageSharp.fluid}
      heroBackground="#E0DFE4"
      alt="Picture of Alisha and Milind in front of a large stone rock face"
    >
      <SEO title="Our Story" />
      <PageHeading>Our Story</PageHeading>
      <section className="c-article">
        <p>
          When Milind and Alisha met, he was struck by her passion and
          wittiness; she was impressed by his encyclopedic knowledge of obscure
          facts. When they are not debating British vs American grammar rules
          (truly they are 200-year-olds in 20-something-year-old bodies), you
          will find them engrossed in a board game, stumbling through the
          wilderness, or yelling out fruits and woods in a feeble attempt at
          describing wine.
        </p>
        <ImageGrid
          images={[
            {
              image: data.chicago.childImageSharp.fluid,
              alt:
                "Selfie of Milind and Alisha with snowfall in the foreground",
              caption: "Chicago",
            },
            {
              image: data.yosemite.childImageSharp.fluid,
              alt:
                "Selfie of Milind and Alisha in backpacking clothes and gear",
              caption: "Yosemite National Park",
            },
            {
              image: data.redRock.childImageSharp.fluid,
              alt:
                "Picture of Milind and Alisha in Red Rock National Canyon, Las Vegas",
              caption: "Red Rock Canyon",
            },
            {
              image: data.edinburgh.childImageSharp.fluid,
              alt:
                "Picture of Milind and Alisha in front of a monument on Calton Hill in Edinburgh, Scotland",
              caption: "Edinburgh, Scotland",
            },
            {
              image: data.tahoe.childImageSharp.fluid,
              alt: "Selfie of Milind and Alisha in front of Lake Tahoe",
              caption: "Lake Tahoe",
            },
            {
              image: data.halloween.childImageSharp.fluid,
              alt:
                "Picture of Milind in a Tapatio t-shirt and Alisha in a Sriracha t-shirt at Halloween in San Francisco",
              caption: "“Hot sauce” Halloween",
            },
          ]}
        />
      </section>
      <section className="c-article" aria-labelledby="heading-proposal">
        <h2 id="heading-proposal">The Proposal</h2>
        <p>
          Alisha&rsquo;s friends thought Milind would certainly propose when the
          couple went to see{" "}
          <a href="https://en.wikipedia.org/wiki/Hamilton_(musical)">
            Hamilton
          </a>{" "}
          the musical, so that the photo caption could have been &ldquo;
          <a href="https://www.youtube.com/watch?v=WySzEXKUSZw">
            The Room Where It Happened
          </a>{" "}
          {<Emoji symbol="💎" label="diamond emoji" />}&rdquo; &mdash; but
          Milind has never been one to take the obvious route. Instead, he
          patiently waited until a few weeks later when Milind and Alisha
          visited the{" "}
          <a href="https://legionofhonor.famsf.org/">Legion of Honor Museum</a>.
          Alisha, unsuspecting as ever after spending hours underground at a
          mummies exhibit, led Milind straight to the proposal spot so that she
          could take a photo of that VIEW (you know, the one with the bridge).
          He had smoothly arranged for their friend to already be there,
          incognito, to capture the moment. And well, we know how that story
          ends. {<Emoji symbol="😊" label="smiley face emoji" />}
        </p>
        <ImageGrid
          images={[
            {
              image: data.proposal1.childImageSharp.fluid,
              alt:
                "Picture of Milind proposing to Alisha with a view of the Golden Gate Bridge in the background",
              objectPosition: "50% 70%",
            },
            {
              image: data.proposal2.childImageSharp.fluid,
              alt:
                "Picture of Alisha and Milind at dinner celebrating engagement",
            },
          ]}
        />
      </section>
    </NavLayout>
  )
}
export default OurStoryPage
