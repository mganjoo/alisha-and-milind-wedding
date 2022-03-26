import { Link, useStaticQuery, graphql } from "gatsby"
import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import Authenticated from "../components/partials/Authenticated"
import ContactEmail from "../components/partials/ContactEmail"
import Faq from "../components/partials/Faq"
import Emoji from "../components/ui/Emoji"
import ExternalLink from "../components/ui/ExternalLink"
import ImageGrid from "../components/ui/ImageGrid"
import PageHeading from "../components/ui/PageHeading"
import { WeddingMetadataContext } from "../utils/WeddingMetadataContext"

const FaqPage = () => {
  const data = useStaticQuery(
    graphql`
      query {
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
      }
    `
  )
  return (
    <NavLayout>
      <SEO
        title="FAQ"
        image="/meta-faq-hero.jpg"
        description="Answers to some common questions about RSVP, attire, and what to do in the Bay Area."
      />
      <PageHeading>Frequently Asked Questions</PageHeading>
      <Authenticated>
        <WeddingMetadataContext.Consumer>
          {(value) => (
            <>
              <Faq question="What safety measures will be in place for COVID-19?">
                <p>
                  In light of the pandemic, we are looking to both federal and
                  state health guidelines to maintain a safe celebratory
                  environment. In this effort, we are asking our guests to
                  please RSVP{" "}
                  <strong>
                    only if they are or will be fully vaccinated by the start of
                    the event
                  </strong>
                  . For those who are unable to receive the vaccine, we kindly
                  request a negative COVID test within a 48-hour period of
                  attending any wedding event.
                </p>
                <p>
                  We will have masks and hand sanitizing stations readily
                  available. We have selected our venue based on the ability to
                  spread out, though we do want to share that we are
                  anticipating around 300 guests for the indoor reception. We
                  value each and every one of you dearly, so please know that we
                  fully understand if this arrangement is not within your
                  comfort level, particularly given that many folks may be
                  traveling in for the event.
                </p>
                <p>
                  We will continue to track guidance from the{" "}
                  <ExternalLink href="https://www.cdc.gov/coronavirus/2019-ncov/index.html">
                    CDC
                  </ExternalLink>{" "}
                  and{" "}
                  <ExternalLink href="https://nvhealthresponse.nv.gov/">
                    Nevada Health Response
                  </ExternalLink>{" "}
                  and will share any updates related to safety accordingly on
                  this website.
                </p>
              </Faq>
              <Faq question="What are the important dates to note?">
                <p>
                  We know this is a very quick timeline with the wedding
                  celebration weekend approaching so soon. Here are the most
                  important deadlines to keep in mind:
                </p>
                <ul>
                  <li>
                    <strong>{value?.bookingDeadlineLong}</strong>: Deadline to
                    book your hotel room from the wedding block
                  </li>
                  <li>
                    <strong>{value?.rsvpDeadlineLong}</strong>: Deadline for
                    RSVPs
                  </li>
                </ul>
              </Faq>
              <Faq question="How should I RSVP?">
                <p>
                  Please visit the <Link to="/rsvp">RSVP</Link> page to fill out
                  the form online (your email address may be required).
                </p>
                <p>
                  We are asking for guests to please RSVP by{" "}
                  <strong>{value?.rsvpDeadline}</strong>. However, if you plan
                  on reserving a hotel room from the wedding block, please know
                  that the hotel requires that the wedding block be closed one
                  month prior to the event, so your room would need to be booked
                  by <strong>{value?.bookingDeadline}</strong>. We understand
                  the importance of flexibility during this time. Please know
                  that you can edit your RSVP online at any time up until one
                  week before the event ({value?.rsvpChangeDeadline}).
                </p>
                <p>
                  If you have any questions about the RSVP, or if you notice we
                  have made a mistake (our sincerest apologies!), please reach
                  out to us at <ContactEmail />.
                </p>
              </Faq>
              <Faq question="How do I book my hotel room?">
                <p>
                  Please see the <Link to="/travel">Travel &amp; Hotel</Link>{" "}
                  page for a link to book your room from the wedding block.
                  Please book by <strong>{value?.bookingDeadline}</strong> to
                  ensure room availability at the special rate. If you are
                  unable to book by this deadline, please know that you can
                  still reserve your room directly on JW Marriot&rsquo;s website
                  at the hotel&rsquo;s rate.
                </p>
              </Faq>
              <Faq question="If I booked a hotel room from the wedding block, what happens if I need to cancel?">
                <p>
                  The cancellation policy for the hotel block allows for a full
                  refund as long as the reservation is cancelled at least two
                  days prior to your scheduled arrival date. If the room is
                  cancelled any later than that, the hotel may charge one
                  night&rsquo;s room rate, plus taxes.
                </p>
              </Faq>
              <Faq question="What should I wear?">
                <p>
                  Indian weddings are joyous, colorful celebrations, and we
                  invite you to wear whatever festive clothes you feel most
                  comfortable in! Here are some ideas:
                </p>
                <ul>
                  <li>
                    Indian festive: sari, lehenga, anarkali, salwar kameez,
                    kurta pajama, sherwani, nehru jacket
                  </li>
                  <li>
                    Western semi-formal: cocktail dress, jumpsuit, skirt, dress
                    shirt, slacks, jacket
                  </li>
                  <li>
                    Western formal: maxi skirt, gown, suit and tie, tuxedo
                  </li>
                </ul>
                <p>A couple of other notes:</p>
                <ul>
                  <li>
                    There will be lots of dancing so choose your footwear
                    accordingly! If that means ditching shoes under the table at
                    some point in the night to really make the open dance floor
                    count, that&rsquo;s fine by us!{" "}
                    <Emoji symbol="💃🏾" label="dancing emoji" />
                  </li>
                  <li>
                    We love sharing our cultural traditions with you all. If you
                    are excited to wear Indian attire but are not sure where to
                    start, let us know! There are many options to rent or buy
                    clothes in stores or online, or borrow from friends/us!
                  </li>
                </ul>
              </Faq>
              <ImageGrid
                images={[
                  {
                    image: data.clothes1.childImageSharp.gatsbyImageData,
                    id: "clothes1",
                    alt: "Alisha dressed in a red patterned lehenga and Milind dressed in a black kurta and churidar.",
                    objectPosition: "50% 95%",
                  },
                  {
                    image: data.clothes2.childImageSharp.gatsbyImageData,
                    id: "clothes2",
                    alt: "Alisha in a fuhscia-colored lehenga and Milind in a black suit and bowtie.",
                  },
                  {
                    image: data.clothes3.childImageSharp.gatsbyImageData,
                    id: "clothes3",
                    alt: "Milind in a maroon sherwani and Alisha in a green salwar kameez.",
                    objectPosition: "50% 25%",
                  },
                  {
                    image: data.clothes4.childImageSharp.gatsbyImageData,
                    id: "clothes4",
                    alt: "Milind in a peacock-blue kurta, and Alisha in a fuchsia-colored lehenga.",
                    objectPosition: "50% 35%",
                  },
                ]}
              />
              <Faq question="What will the weather be like this time of year?">
                <p>
                  We hope to beat the intense heat of Vegas summers, but we
                  anticipate it will still be quite warm at the end of May.
                  Temperatures tend to range from 85 to 95 °F (30 to 35 °C)
                  around this time of year.
                </p>
              </Faq>
              <Faq question="Are you accepting gifts?">
                <p>
                  We truly value your presence, now more than ever, above any
                  gift!
                </p>
                <p>
                  For those who insist, you can visit the{" "}
                  <Link to="/registry">Registry</Link> page to view our Zola
                  registry, and we will also keep a box for cards at the
                  reception. We humbly request no boxed gifts at the event.
                </p>
              </Faq>
              <Faq question="Is it okay to take photos or videos during the event?">
                <p>
                  Absolutely! Our social media hashtag is{" "}
                  <strong>{value?.hashtag}</strong>. Certainly no pressure to
                  capture, though &mdash; we spend plenty of time in front of
                  screens these days. We will share our photographer&rsquo;s
                  shots with you as well.
                </p>
              </Faq>
              <Faq question="What cuisine will be served at the event?">
                <p>
                  Indian food will be served buffet-style, and will include
                  vegetarian, gluten-free, and dairy-free options. We want to
                  ensure everyone is fully powered for breaking a sweat on the
                  dance floor after eating, so please do reach out to us with
                  any dietary needs!
                </p>
              </Faq>
              <Faq question="What are some fun things to do in Las Vegas?">
                <p>
                  The internet will provide you with great guidance, especially
                  for first-time visitors. But for our family and friends who
                  are spending some extra time in the area (or want to bookmark
                  this for a later trip!), here is the Alisha &amp; Milind
                  edition of our favorite things to do in the (Vegas) Valley.
                </p>
                <h3>The Strip (duh!)</h3>
                <ul>
                  <li>
                    The food options here are endless. Some of our favorites are{" "}
                    <ExternalLink href="https://www.runchickenrun.com/las-vegas/">
                      Yardbird
                    </ExternalLink>{" "}
                    at The Venetian and{" "}
                    <ExternalLink href="https://www.caesars.com/caesars-palace/restaurants/bacchanal-buffet">
                      Bacchanal
                    </ExternalLink>{" "}
                    at Caesars Palace.
                  </li>
                  <li>
                    <ExternalLink href="https://www.cosmopolitanlasvegas.com/">
                      The Cosmopolitan
                    </ExternalLink>{" "}
                    gets its own bullet point because it’s a personal favorite
                    across the board. Any (really, any) of the{" "}
                    <ExternalLink href="https://www.cosmopolitanlasvegas.com/restaurants">
                      restaurants
                    </ExternalLink>{" "}
                    there are a good time. The hotel rooms have some of the best
                    views on The Strip. And the place is teeming with hidden
                    treasures waiting to be stumbled upon, from speakeasies to
                    secret pizza and off-the-menu cocktails.
                  </li>
                  <li>
                    The Saxenas love playing tourist in Vegas to check out the
                    incredible seasonal creations at the{" "}
                    <ExternalLink href="https://bellagio.mgmresorts.com/en/entertainment/conservatory-botanical-garden.html">
                      Conservatory at Bellagio
                    </ExternalLink>{" "}
                    before wrapping up the night with some gelato from{" "}
                    <ExternalLink href="https://bellagio.mgmresorts.com/en/restaurants/bellagio-patisserie.html">
                      Patisserie
                    </ExternalLink>
                    . And of course there&rsquo;s that{" "}
                    <ExternalLink href="https://bellagio.mgmresorts.com/en/entertainment/fountains-of-bellagio.html">
                      iconic fountain
                    </ExternalLink>{" "}
                    featured in many a Vegas movie!
                  </li>
                  <li>
                    Shop &rsquo;til you drop!{" "}
                    <ExternalLink href="https://www.simon.com/mall/the-forum-shops-at-caesars-palace">
                      The Forum Shops
                    </ExternalLink>{" "}
                    and{" "}
                    <ExternalLink href="https://www.fslv.com/en.html">
                      Fashion Show Mall
                    </ExternalLink>{" "}
                    are good places to start.
                  </li>
                  <li>
                    <ExternalLink href="https://www.cirquedusoleil.com/las-vegas">
                      Cirque du Soleil
                    </ExternalLink>{" "}
                    shows are worth the hype. The Beatles LOVE and KÀ are on our
                    Don&rsquo;t Miss list.
                  </li>
                </ul>

                <h3>The Chill List</h3>
                <ul>
                  <li>
                    Take a scenic drive through{" "}
                    <ExternalLink href="https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon-national-conservation-area/planning-your-visit">
                      Red Rock Canyon
                    </ExternalLink>
                    , about a 10-minute drive west of the JW Marriott.
                  </li>
                  <li>
                    If you are staying at the resort, treat yourself to a{" "}
                    <ExternalLink href="https://www.marriott.com/hotels/hotel-information/fitness-spa-services/details/lasjw-jw-marriott-las-vegas-resort-and-spa/5013971/">
                      spa day
                    </ExternalLink>
                    ! Those feet could use a good massage after all that
                    dancing.
                  </li>
                </ul>

                <h3>The Foodie List</h3>
                <ul>
                  <li>
                    Las Vegas is a food-lover&rsquo;s dream &mdash; from
                    hole-in-the-wall spots to world-renowned restaurants, the
                    local culinary world is rich. We are creatures of habit
                    though, so we have been frequenting the same five
                    restaurants for years:{" "}
                    <ExternalLink href="https://www.kingandilakes.com/">
                      King &amp; I
                    </ExternalLink>
                    ,{" "}
                    <ExternalLink href="https://honeysalt.com/">
                      Honey Salt
                    </ExternalLink>
                    ,{" "}
                    <ExternalLink href="http://grapestreetdowntownsummerlin.com/">
                      Grape Street Cafe
                    </ExternalLink>
                    ,{" "}
                    <ExternalLink href="https://www.wynnlasvegas.com/dining/casual-dining/red-8">
                      Red 8
                    </ExternalLink>
                    , and{" "}
                    <ExternalLink href="https://www.digitalmenuclub.com/">
                      El Dorado Cantina
                    </ExternalLink>
                    .
                  </li>
                </ul>

                <h3>The Day Trip List</h3>
                <ul>
                  <li>
                    Head on up to{" "}
                    <ExternalLink href="https://www.gomtcharleston.com/">
                      Mount Charleston
                    </ExternalLink>
                    , about 40 minutes away from the hotel, for a snowy escape.
                  </li>
                  <li>
                    Rewatch Transformers for that iconic scene of{" "}
                    <ExternalLink href="https://www.usbr.gov/lc/hooverdam/">
                      Hoover Dam
                    </ExternalLink>{" "}
                    before heading out to the real one, an approximately
                    50-minute drive from the JW Marriott.
                  </li>
                </ul>
              </Faq>
              <Faq question="What if I have other questions?">
                <p>
                  The best way to reach us is at <ContactEmail />. There are two
                  types of people in this world: Alisha is the zero-inbox type,
                  while Milind is the 1,000-unread messages type, but he claims
                  he has a system. Either way, we&rsquo;ll get back to you super
                  pronto!
                </p>
              </Faq>
            </>
          )}
        </WeddingMetadataContext.Consumer>
      </Authenticated>
    </NavLayout>
  )
}
export default FaqPage
