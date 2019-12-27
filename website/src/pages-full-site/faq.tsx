import { Link, useStaticQuery, graphql } from "gatsby"
import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import ContactEmail from "../components/partials/ContactEmail"
import Faq from "../components/partials/Faq"
import Emoji from "../components/ui/Emoji"
import ExternalLink from "../components/ui/ExternalLink"
import ImageGrid from "../components/ui/ImageGrid"
import PageHeading from "../components/ui/PageHeading"

const FaqPage = () => {
  const data = useStaticQuery(
    graphql`
      query {
        heroImage: file(relativePath: { eq: "faq-hero.jpg" }) {
          childImageSharp {
            ...HeroImage
          }
        }
        clothes1: file(relativePath: { eq: "faq-clothes-1.jpg" }) {
          childImageSharp {
            ...GridImage
          }
        }
        clothes2: file(relativePath: { eq: "faq-clothes-2.jpg" }) {
          childImageSharp {
            ...GridImage
          }
        }
        clothes3: file(relativePath: { eq: "faq-clothes-3.jpg" }) {
          childImageSharp {
            ...GridImage
          }
        }
        clothes4: file(relativePath: { eq: "faq-clothes-4.jpg" }) {
          childImageSharp {
            ...GridImage
          }
        }
        site {
          siteMetadata {
            rsvpDeadline(formatString: "MMMM D, YYYY")
            bookingDeadline(formatString: "MMMM D, YYYY")
          }
        }
      }
    `
  )
  return (
    <NavLayout
      heroImage={data.heroImage.childImageSharp.fluid}
      heroBackground="bg-gray-200"
      alt="Milind and Alisha wearing sunglasses, posing among plants in a nursery"
    >
      <SEO title="Frequently Asked Questions" image="/meta-faq-hero.jpg" />
      <PageHeading>Frequently Asked Questions</PageHeading>
      <Faq question="How should I RSVP?">
        <p>
          Please visit the <Link to="/rsvp">RSVP</Link> page to fill out the
          form online (your email address may be required). Please confirm the
          spellings of the names for the guests in your party and confirm your
          attendance. You will then be able to indicate specifically which
          events each guest will be attending on the next page.
        </p>
        <p>
          You will be able to edit your RSVP once you have submitted the form,
          but we kindly ask that final RSVPs be submitted by{" "}
          <strong>{data.site.siteMetadata.rsvpDeadline}</strong>. If you have
          any questions about the RSVP, or if you notice we have made a mistake
          (our sincerest apologies!), please reach out to us at <ContactEmail />
          .
        </p>
      </Faq>
      <Faq question="What should I wear?">
        <p>
          Indian weddings are joyous, colorful celebrations, and we invite you
          to wear whatever festive clothes you feel most comfortable in! Here
          are some ideas:
        </p>
        <ul>
          <li>
            Indian festive: sari, lehenga, anarkali, salwar kameez, kurta
            pajama, sherwani, nehru jacket
          </li>
          <li>
            Western semi-formal: cocktail dress, jumpsuit, skirt, dress shirt,
            slacks, jacket
          </li>
          <li>Western formal: maxi skirt, gown, suit and tie, tuxedo</li>
        </ul>
        <p>A couple of other notes:</p>
        <ul>
          <li>
            Every event (literally every one) involves dancing so choose your
            footwear accordingly! If that means ditching shoes under the table
            at some point in the night to really make the open dance floor
            count, that&rsquo;s fine by us!{" "}
            <Emoji symbol="💃🏾" label="dancing emoji" />
          </li>
          <li>
            We look forward to sharing our culture with all of our wedding
            guests. If you are excited to wear Indian attire but are not sure
            where to start, reach out to us! There are many options to rent or
            buy clothes in stores or online, or borrow from friends!
          </li>
        </ul>
      </Faq>
      <ImageGrid
        images={[
          {
            image: data.clothes1.childImageSharp.fluid,
            alt:
              "Alisha dressed in a gold-colored lehenga and Milind dressed in a black kurta and churidar",
            objectPosition: "50% 25%",
          },
          {
            image: data.clothes2.childImageSharp.fluid,
            alt:
              "Milind in a peacock-blue kurta, and Alisha in a fuchsia-colored lehenga",
          },
          {
            image: data.clothes3.childImageSharp.fluid,
            alt:
              "Milind in a maroon sherwani and Alisha in a green salwar kameez",
            objectPosition: "50% 35%",
          },
          {
            image: data.clothes4.childImageSharp.fluid,
            alt:
              "Alisha in a fuhscia-colored lehenga and Milind in a black suit and bowtie",
          },
        ]}
      />
      <Faq question="Do you have a hotel room block?">
        <p>
          We sure do! Please see the{" "}
          <Link to="/travel#hotel-block">Travel &amp; Accommodations</Link> page
          for details, as well as the link to book with our discounted rate.
          Please book by{" "}
          <strong>{data.site.siteMetadata.bookingDeadline}</strong> to ensure
          room availability.
        </p>
      </Faq>
      <Faq question="What will the weather be like this time of year?">
        <p>
          San Mateo in early May can be a little crisp in the mornings before
          climbing to the mid-to-high 60s °F / 20s °C. While most of the events
          will be indoors, the baraat and the wedding ceremony on Saturday
          morning will be outdoors. We will have a contingency plan for rain,
          but for now, plan on spending the morning under the California sky!
        </p>
      </Faq>
      <Faq question="Are you accepting gifts?">
        <p>We humbly request no boxed gifts at the wedding.</p>
      </Faq>
      <Faq question="Is it okay to take photos or videos during the wedding events?">
        <p>
          Absolutely! Our social media hashtag is{" "}
          <strong>#AlishaWinsAMil</strong>. Certainly no pressure to capture,
          though! We will share our photographer&rsquo;s shots with you as well.
        </p>
      </Faq>
      <Faq question="What will the cuisine be at the wedding events?">
        <p>
          Indian food will be served at every event, buffet style. This will
          include vegetarian, gluten-free, and dairy-free options. We want to
          ensure everyone is safe and comfortable so please do reach out to us
          with any dietary concerns!
        </p>
      </Faq>
      <Faq question="What are some fun things to do in the Bay Area?">
        <p>
          There are truly a million things to do here and the internet will
          provide you with great guidance, especially for first-time visitors!
          For our guests who are spending some extra time in the area (great
          choice!), here is the Alisha &amp; Milind edition of top things to do
          in the Bay Area.
        </p>

        <h4>The Abridged List of Essentials</h4>
        <ul>
          <li>
            Run/bike/walk across the Golden Gate Bridge (if you&rsquo;re like
            Milind) or gaze upon it from a{" "}
            <ExternalLink href="https://www.presidio.gov/places/golden-gate-bridge-welcome-center">
              scenic viewpoint
            </ExternalLink>{" "}
            (if you&rsquo;re like Alisha).
          </li>
          <li>
            We love the{" "}
            <ExternalLink href="https://www.everywhereist.com/2012/08/the-view-from-the-hamon-observation-tower-san-francisco/">
              Hamon Observation Tower
            </ExternalLink>{" "}
            in the de Young Museum (free admission to the top!), the{" "}
            <ExternalLink href="https://www.japaneseteagardensf.com/">
              Japanese Tea Garden
            </ExternalLink>
            , and the{" "}
            <ExternalLink href="https://www.calacademy.org/exhibits/osher-rainforest">
              Osher Rainforest
            </ExternalLink>{" "}
            at the California Academy of Sciences that are all located next to
            each other in Golden Gate Park.
          </li>
          <li>
            If you enjoy touring university campuses as much as our parents do,
            Stanford University is highly photogenic. Milind recommends getting
            a sandwich at his tried-and-true favorite{" "}
            <ExternalLink href="https://www.cohostanford.com/">
              CoHo
            </ExternalLink>
            , taking in the views from the top of{" "}
            <ExternalLink href="https://visit.stanford.edu/plan/guides/hoover.html">
              Hoover Tower
            </ExternalLink>
            , and walking around the Main Quad. Alisha recommends strolling
            through the little-known{" "}
            <ExternalLink href="https://lbre.stanford.edu/bgm/what-we-do/grounds-services/horticulture-and-landscape/points-interest/arizona-garden">
              Arizona Garden
            </ExternalLink>{" "}
            as well as the well-known{" "}
            <ExternalLink href="https://web.stanford.edu/dept/suma/view/rodin.html">
              Rodin Sculpture Garden
            </ExternalLink>{" "}
            in the Cantor Arts Center.
          </li>
        </ul>

        <h4>The Short Road Trip List</h4>
        <ul>
          <li>Sip the best wine in Napa Valley or Sonoma Valley.</li>
          <li>
            Don&rsquo;t miss the jellyfish at the{" "}
            <ExternalLink href="https://www.montereybayaquarium.org/">
              Monterey Bay Aquarium
            </ExternalLink>
            !
          </li>
          <li>
            Hike amidst the redwoods at{" "}
            <ExternalLink href="https://www.nps.gov/muwo/index.htm">
              Muir Woods
            </ExternalLink>
            .
          </li>
          <li>
            Soak up the sun at the{" "}
            <ExternalLink href="https://beachboardwalk.com/">
              Santa Cruz Boardwalk
            </ExternalLink>
            .
          </li>
        </ul>

        <h4>The Chill List (for the chillest)</h4>
        <ul>
          <li>
            Lay out on the grass between the palms and take in the
            &ldquo;atmosphere&rdquo; of Dolores Park.
          </li>
          <li>
            Head to Twin Peaks to get incredible views of the city, mountains,
            and water.
          </li>
          <li>
            San Francisco&rsquo;s beaches are gray and cold, but warm up by the
            fire pits on Ocean Beach.
          </li>
          <li>
            You just spent all weekend dancing on those feet and now you want to
            sit back and relax. For a quirky, indoor experience, we love{" "}
            <ExternalLink href="https://drafthouse.com/sf">
              Alamo Drafthouse Cinema
            </ExternalLink>
            . They create their own trailers relevant to the movie you&rsquo;re
            there to see, and food and drinks get delivered directly to your
            seat.
          </li>
        </ul>

        <h4>The Foodie List</h4>
        <ul>
          <li>
            Alisha&rsquo;s favorite sweet treat: the baklava frozen Greek yogurt
            at{" "}
            <ExternalLink href="https://www.souvla.com/">Souvla</ExternalLink>{" "}
            (but all the food there is delicious).
          </li>
          <li>
            Milind&rsquo;s favorite savory treats: the Mission burrito (try{" "}
            <ExternalLink href="https://www.yelp.com/biz/el-farolito-san-francisco-2">
              El Farolito
            </ExternalLink>
            !) or the burger at{" "}
            <ExternalLink href="https://www.yelp.com/biz/nopa-san-francisco">
              Nopa
            </ExternalLink>
            .
          </li>
          <li>
            San Francisco is known for the sourdough bread bowls with clam
            chowder, for which{" "}
            <ExternalLink href="https://boudinbakery.com/home/">
              Boudin Bakery
            </ExternalLink>{" "}
            is popular! For seafood aficionados, keep{" "}
            <ExternalLink href="https://www.yelp.com/biz/hog-island-oyster-co-san-francisco">
              Hog Island Oyster Co
            </ExternalLink>{" "}
            on your radar.
          </li>
        </ul>
      </Faq>
      <Faq question="Anything else I should know?">
        <p>
          Heh, well, our travel and work schedules have been all over the place,
          so we got a bit delayed in scheduling our pre-wedding photoshoot.
          Check back here late January/early February for some photo updates!
        </p>
      </Faq>
      <Faq question="How do I contact you if I have other questions?">
        <p>
          The best way to reach us is at <ContactEmail />. There are two types
          of people in this world, and Alisha is the zero-inbox type. Milind is
          the other type, but he claims he has a system. Either way, we&rsquo;ll
          get back to you ASAP!
        </p>
      </Faq>
    </NavLayout>
  )
}
export default FaqPage
