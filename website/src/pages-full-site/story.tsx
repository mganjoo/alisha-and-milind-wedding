import { useStaticQuery, graphql } from "gatsby"
import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import Emoji from "../components/ui/Emoji"
import ExternalLink from "../components/ui/ExternalLink"
import ImageGrid from "../components/ui/ImageGrid"
import PageHeading from "../components/ui/PageHeading"

const StoryPage = () => {
  const data = useStaticQuery(
    graphql`
      query {
        heroImage: file(relativePath: { eq: "story-hero.jpg" }) {
          childImageSharp {
            ...HeroImage
          }
        }
        redRock: file(relativePath: { eq: "story-travel-red-rock.jpg" }) {
          childImageSharp {
            ...GridImage
          }
        }
        tahoe: file(relativePath: { eq: "story-travel-tahoe.jpg" }) {
          childImageSharp {
            ...GridImage
          }
        }
        edinburgh: file(relativePath: { eq: "story-travel-edinburgh.jpg" }) {
          childImageSharp {
            ...GridImage
          }
        }
        yosemite: file(relativePath: { eq: "story-travel-yosemite.jpg" }) {
          childImageSharp {
            ...GridImage
          }
        }
        chicago: file(relativePath: { eq: "story-travel-chicago.jpg" }) {
          childImageSharp {
            ...GridImage
          }
        }
        halloween: file(relativePath: { eq: "story-travel-halloween.jpg" }) {
          childImageSharp {
            ...GridImage
          }
        }
        proposal1: file(relativePath: { eq: "story-proposal-1.jpg" }) {
          childImageSharp {
            ...GridImage
          }
        }
        proposal2: file(relativePath: { eq: "story-proposal-2.jpg" }) {
          childImageSharp {
            ...GridImage
          }
        }
      }
    `
  )
  return (
    <NavLayout
      heroImage={data.heroImage.childImageSharp.fluid}
      alt="Picture of Alisha and Milind in front of a large stone rock face"
    >
      <SEO
        title="Our Story"
        image="/meta-story-hero.jpg"
        description="Get to know us as a couple and read about our engagement!"
      />
      <PageHeading>Our Story</PageHeading>
      <section className="c-article">
        <p>
          When Milind and Alisha first met, he was struck by her passion and
          wittiness; she was impressed by his encyclopedic knowledge of obscure
          facts. In the Bay Area, Alisha is finishing up her doctorate in
          clinical psychology, while Milind is a machine learning software
          engineer &mdash; and so emotional intelligence meets artificial
          intelligence!
        </p>
        <p>
          When they are not debating British vs American grammar rules (truly
          they are 200-year-olds in 20-something-year-old bodies), you will find
          them engrossed in a board game, trying to beat each other&rsquo;s
          crossword times, stumbling through the wilderness while Alisha
          captures it on camera, or yelling out fruits and woods in a feeble
          attempt at describing wine.
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
              objectPosition: "50% 5%",
            },
          ]}
        />
      </section>
      <section className="c-article" aria-labelledby="heading-proposal">
        <h2 id="heading-proposal">The proposal</h2>
        <p>
          Alisha&rsquo;s friends thought Milind would certainly propose when the
          couple went to see{" "}
          <ExternalLink href="https://en.wikipedia.org/wiki/Hamilton_(musical)">
            Hamilton
          </ExternalLink>{" "}
          the musical, so that the photo caption could have been &ldquo;
          <ExternalLink href="https://www.youtube.com/watch?v=WySzEXKUSZw">
            The Room Where It Happened
          </ExternalLink>{" "}
          {<Emoji symbol="💎" label="diamond emoji" />}&rdquo; &mdash; but
          Milind has never been one to take the obvious route. Instead, having
          found the perfect scenic proposal spot while on one of his weekend
          distance runs, he scheduled a trip to the{" "}
          <ExternalLink href="https://legionofhonor.famsf.org/">
            Legion of Honor Museum
          </ExternalLink>{" "}
          a few weeks later. Alisha, unsuspecting as ever after spending hours
          underground at a mummies exhibit, conveniently led Milind straight to
          the proposal spot so that she could take a photo of that VIEW (you
          know, the one with the bridge). He had smoothly arranged for their
          friend to already be there, incognito, to capture the moment. And
          well, we know how that story ends.{" "}
          {<Emoji symbol="😊" label="smiley face emoji" />}
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
export default StoryPage
