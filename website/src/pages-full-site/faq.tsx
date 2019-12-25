import { Link } from "gatsby"
import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import ContactEmail from "../components/partials/ContactEmail"
import Faq from "../components/partials/Faq"
import Emoji from "../components/ui/Emoji"
import PageHeading from "../components/ui/PageHeading"

const FaqPage = () => (
  <NavLayout>
    <SEO title="FAQ" />
    <PageHeading>FAQ</PageHeading>
    <Faq question="What should I wear?">
      <p>
        Indian weddings are joyous, colorful celebrations, and we invite you to
        wear whatever festive clothes you feel most comfortable in! Here are
        some ideas:
      </p>
      <ul>
        <li>
          Indian festive: sari, lehenga, anarkali, salwar kameez, kurta pajama,
          sherwani, nehru jacket
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
          footwear accordingly! That may also mean ditching shoes under the
          table to really make the open dance floor count.{" "}
          <Emoji symbol="💃🏾" label="dancing emoji" />
        </li>
        <li>
          We are really excited to share our culture with all of our wedding
          guests. If you are excited to wear Indian attire but are not sure
          where to start, reach out to us! There are many options to rent or buy
          clothes in store or online (or borrow from friends!).
        </li>
      </ul>
    </Faq>
    <Faq question="What will the weather be like this time of year?">
      <p>
        The beginning of May in San Mateo can be a little crisp in the mornings
        and then climbs to the high 60s °F / 20s °C. While most of the events
        will be indoors, we will be outdoors on Saturday morning for the baraat
        and the wedding ceremony. We will have a contingency plan for rain, but
        for now, plan on spending the morning under the California sky!
      </p>
    </Faq>
    <Faq question="Do you have a hotel room block for the wedding?">
      <p>
        We sure do! Please see the{" "}
        <Link to="/travel#hotel-block">Travel &amp; Accommodations</Link> page
        for details, as well as the link to book with our discounted rate.
      </p>
    </Faq>
    <Faq question="Are you accepting gifts?">
      <p>We request no boxed gifts at the wedding.</p>
    </Faq>
    <Faq question="Is it okay to take photos or videos during the wedding events?">
      <p>
        Absolutely! Our hashtag is <strong>#AlishaWinsAMil</strong> for social
        media. And certainly no pressure to capture! We will share our
        photographer&rsquo;s shots with you.
      </p>
    </Faq>
    <Faq question="What will the cuisine be at the wedding events?">
      <p>
        Indian food will be served at every event, buffet style. We will have
        vegetarian, gluten-free, and dairy-free options as well.
      </p>
    </Faq>
    <Faq question="How do I contact you if I have other questions?">
      <p>
        The best way to reach us is at <ContactEmail /> and we&rsquo;ll get back
        to you ASAP! There are two types of people in this world, and Alisha is
        the zero-inbox type. Milind is the other type, but we don&rsquo;t like
        to talk about it.
      </p>
    </Faq>
    <Faq question="What are some fun things to do in the Bay Area?">
      <p>TODO</p>
    </Faq>
  </NavLayout>
)
export default FaqPage
