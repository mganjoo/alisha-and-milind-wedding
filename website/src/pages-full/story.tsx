import { useStaticQuery, graphql } from "gatsby"
import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import Authenticated from "../components/partials/Authenticated"
import ImageGrid from "../components/ui/ImageGrid"
import PageHeading from "../components/ui/PageHeading"

const StoryPage = () => {
  const data = useStaticQuery(
    graphql`
      query {
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
        sandiego: file(relativePath: { eq: "story-travel-san-diego.jpg" }) {
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
        proposal: file(relativePath: { eq: "story-proposal.jpg" }) {
          childImageSharp {
            ...GridImage
          }
        }
        wedding: file(relativePath: { eq: "story-wedding.jpg" }) {
          childImageSharp {
            ...GridImage
          }
        }
      }
    `
  )
  return (
    <NavLayout>
      <SEO
        title="Our Story"
        image="/meta-story-hero.jpg"
        description="Get to know us as a couple and read about our engagement!"
      />
      <PageHeading>Our Story</PageHeading>
      <Authenticated>
        <section className="c-article">
          <p>
            Alisha and Milind&rsquo;s story is a lot like many other couples.
            They met, fell in love, planned their wedding, and then a global
            pandemic hit and shook up everyone’s worlds.
          </p>
          <p>
            If you wanted the longer version: Alisha and Milind met on a blind
            date set up by their good friend Trishna. Milind was struck by
            Alisha&rsquo;s wittiness and passion for her work; she was impressed
            by his ability to strike up a conversation about any topic under the
            sun. Over the following years, they stumbled through the Yosemite
            backcountry together, sipped whiskey on the Isle of Skye, bridged a
            3000-mile long distance relationship for a while, and performed
            daily Queen Live Aid renditions to an audience of none.
          </p>
          <p>
            Following the postponement of their original wedding date, Alisha
            and Milind got married in a fully virtual courthouse wedding in June
            2020 with their parents and siblings joining in from their own
            living rooms around the world. Soon after, Alisha moved to
            Philadelphia for a year where she had matched for her clinical
            psychology internship and has now returned back to San Francisco.
            Milind has been hard at work diligently raising his chess Elo rating
            (someone binged The Queen&rsquo;s Gambit), and maintaining his
            780-day (and counting) NYT Crossword streak.
          </p>
          <ImageGrid
            images={[
              {
                image: data.chicago.childImageSharp.gatsbyImageData,
                id: "chicago",
                alt: "Selfie of Milind and Alisha dressed in cold weather jackets, with snowfall in the foreground.",
                caption: "Chicago",
              },
              {
                image: data.yosemite.childImageSharp.gatsbyImageData,
                id: "yosemite",
                alt: "Selfie of Milind and Alisha in backpacking clothes and gear, with a forest backdrop.",
                caption: "Yosemite National Park",
              },
              {
                image: data.redRock.childImageSharp.gatsbyImageData,
                id: "redRock",
                alt: "Milind and Alisha laughing at the camera, in front of a red sandstone backdrop.",
                caption: "Red Rock Canyon",
              },
              {
                image: data.sandiego.childImageSharp.gatsbyImageData,
                id: "sandiego",
                alt: "Alisha, dressed in a gray dinosaur sweater and Milind, in a brown leather jacket, laughing at the camera.",
                caption: "San Diego",
                objectPosition: "15% 50%",
              },
              {
                image: data.tahoe.childImageSharp.gatsbyImageData,
                id: "tahoe",
                alt: "Selfie of Milind and Alisha in front of a vast lake.",
                caption: "Lake Tahoe",
              },
              {
                image: data.halloween.childImageSharp.gatsbyImageData,
                id: "halloween",
                alt: "Milind in a white Tapatio t-shirt and red beanie cap, and Alisha in a Sriracha t-shirt and green beanie cap, posing for a selfie at a party.",
                caption: "“Hot sauce” Halloween",
                objectPosition: "50% 5%",
              },
              {
                image: data.proposal.childImageSharp.gatsbyImageData,
                id: "proposal",
                alt: "Milind, on one knee, proposing to Alisha with a ring while she smiles back. The Golden Gate Bridge is visible in the background.",
                caption: "The Proposal - Legion of Honor, SF",
                objectPosition: "50% 70%",
              },
              {
                image: data.wedding.childImageSharp.gatsbyImageData,
                id: "wedding",
                alt: "Alisha and Milind, dressed in Indian clothes, smiling and taking a selfie while holding up a laptop. The laptop shows a video call where members of Milind and Alisha's families are posing for the selfie.",
                caption: "Our virtual wedding",
              },
            ]}
          />
        </section>
      </Authenticated>
    </NavLayout>
  )
}
export default StoryPage
