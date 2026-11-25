import type { PictureData } from "../../lib/picture"
import ImageGrid from "../ui/ImageGrid"
import Authenticated from "./Authenticated"

interface StoryPageProps {
  images: Record<
    | "chicago"
    | "yosemite"
    | "redRock"
    | "sandiego"
    | "tahoe"
    | "halloween"
    | "proposal"
    | "wedding",
    PictureData
  >
}

const StoryPage = ({ images }: StoryPageProps) => (
  <Authenticated>
    <section className="c-article">
      <p>
        Alisha and Milind&rsquo;s story is a lot like many other couples. They
        met, fell in love, planned their wedding, and then a global pandemic hit
        and shook up everyone’s worlds.
      </p>
      <p>
        If you wanted the longer version: Alisha and Milind met on a blind date
        set up by their good friend Trishna. Milind was struck by Alisha&rsquo;s
        wittiness and passion for her work; she was impressed by his ability to
        strike up a conversation about any topic under the sun. Over the
        following years, they stumbled through the Yosemite backcountry
        together, sipped whiskey on the Isle of Skye, bridged a 3000-mile long
        distance relationship for a while, and performed daily Queen Live Aid
        renditions to an audience of none.
      </p>
      <p>
        Following the postponement of their original wedding date, Alisha and
        Milind got married in a fully virtual courthouse wedding in June 2020
        with their parents and siblings joining in from their own living rooms
        around the world. Soon after, Alisha moved to Philadelphia for a year
        where she had matched for her clinical psychology internship and has now
        returned back to San Francisco. Milind has been hard at work diligently
        raising his chess Elo rating (someone binged The Queen&rsquo;s Gambit),
        and maintaining his 780-day (and counting) NYT Crossword streak.
      </p>
      <ImageGrid
        images={[
          {
            image: images.chicago,
            id: "chicago",
            alt: "Selfie of Milind and Alisha dressed in cold weather jackets, with snowfall in the foreground.",
            caption: "Chicago",
          },
          {
            image: images.yosemite,
            id: "yosemite",
            alt: "Selfie of Milind and Alisha in backpacking clothes and gear, with a forest backdrop.",
            caption: "Yosemite National Park",
          },
          {
            image: images.redRock,
            id: "redRock",
            alt: "Milind and Alisha laughing at the camera, in front of a red sandstone backdrop.",
            caption: "Red Rock Canyon",
          },
          {
            image: images.sandiego,
            id: "sandiego",
            alt: "Alisha, dressed in a gray dinosaur sweater and Milind, in a brown leather jacket, laughing at the camera.",
            caption: "San Diego",
            objectPosition: "15% 50%",
          },
          {
            image: images.tahoe,
            id: "tahoe",
            alt: "Selfie of Milind and Alisha in front of a vast lake.",
            caption: "Lake Tahoe",
          },
          {
            image: images.halloween,
            id: "halloween",
            alt: "Milind in a white Tapatio t-shirt and red beanie cap, and Alisha in a Sriracha t-shirt and green beanie cap, posing for a selfie at a party.",
            caption: "“Hot sauce” Halloween",
            objectPosition: "50% 5%",
          },
          {
            image: images.proposal,
            id: "proposal",
            alt: "Milind, on one knee, proposing to Alisha with a ring while she smiles back. The Golden Gate Bridge is visible in the background.",
            caption: "The Proposal - Legion of Honor, SF",
            objectPosition: "50% 70%",
          },
          {
            image: images.wedding,
            id: "wedding",
            alt: "Alisha and Milind, dressed in Indian clothes, smiling and taking a selfie while holding up a laptop. The laptop shows a video call where members of Milind and Alisha's families are posing for the selfie.",
            caption: "Our virtual wedding",
          },
        ]}
      />
    </section>
  </Authenticated>
)

export default StoryPage
