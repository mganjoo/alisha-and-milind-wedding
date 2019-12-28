import { useStaticQuery, graphql } from "gatsby"
import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import ContactEmail from "../components/partials/ContactEmail"
import ExternalLink from "../components/ui/ExternalLink"
import IframeContainer from "../components/ui/IframeContainer"
import PageHeading from "../components/ui/PageHeading"
import Symbol, { SymbolName } from "../components/ui/Symbol"

interface HeadingSymbolProps {
  symbol: SymbolName
  id: string
}

const HeadingSymbol: React.FC<HeadingSymbolProps> = ({
  symbol,
  id,
  children,
}) => (
  <h2 className="flex items-center" id={id}>
    <Symbol symbol={symbol} className="mr-2" size="m" inline />
    {children}
  </h2>
)

const TravelPage = () => {
  const data = useStaticQuery(
    graphql`
      query {
        heroImage: file(relativePath: { eq: "travel-hero.jpg" }) {
          childImageSharp {
            ...HeroImage
          }
        }
        site {
          siteMetadata {
            deadline: bookingDeadline(formatString: "MMMM D, YYYY")
          }
        }
      }
    `
  )
  return (
    <NavLayout
      heroImage={data.heroImage.childImageSharp.fluid}
      alt="Picture of Alisha pointing at something in the distance and Milind looking on"
    >
      <SEO title="Travel & Accommodation" image="/meta-travel-hero.jpg" />
      <PageHeading>Travel &amp; Accommodation</PageHeading>
      <section
        className="c-shadow-box mb-8 sm:flex sm:items-center"
        aria-labelledby="venue-heading"
        aria-describedby="venue-description"
      >
        <div className="font-sans text-lg mb-4 sm:mb-0 sm:w-1/2 sm:flex sm:flex-col sm:items-center">
          <div>
            <h2 className="text-xl font-semibold mb-1" id="venue-heading">
              Venue
            </h2>
            <p id="venue-description">
              San Mateo Marriott San Francisco Airport
            </p>
            <p>1770 S Amphlett Blvd</p>
            <p>San Mateo, CA 94402</p>
          </div>
        </div>
        <div className="sm:w-1/2">
          <IframeContainer
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.938066288461!2d-122.30303634928676!3d37.55652293236051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f9ef215a3c707%3A0xe6ecedc27fd6f6b6!2sSan%20Mateo%20Marriott%20San%20Francisco%20Airport!5e0!3m2!1sen!2sus!4v1577156578989!5m2!1sen!2sus"
            width={400}
            height={300}
            title="Wedding Venue: San Mateo Marriott San Francisco Airport"
            containerClassName="bg-gray-200"
          />
        </div>
      </section>
      <section className="c-article" aria-labelledby="recommended-airport">
        <HeadingSymbol symbol="airplane" id="recommended-airport">
          Recommended airport: SFO
        </HeadingSymbol>
        <p>
          For our friends and family flying in for the festivities, the closest
          airport is{" "}
          <ExternalLink href="https://www.flysfo.com/">
            San Francisco International Airport (SFO)
          </ExternalLink>
          , which is around 8 miles from the hotel.
        </p>
        <dl>
          <dt>Hotel Shuttle</dt>
          <dd>
            There is a complimentary shuttle service between the San Mateo
            Marriott and SFO that runs each hour from 5 am to 10 pm, seven days
            a week. The number for the airport shuttle service is{" "}
            <a href="tel:+1-650-653-6000" className="whitespace-no-wrap">
              +1 (650) 653-6000
            </a>
            . More details about the shuttle service can be found on the{" "}
            <ExternalLink href="https://www.marriott.com/hotels/maps/travel/sfosa-san-mateo-marriott-san-francisco-airport/">
              hotel&rsquo;s website
            </ExternalLink>
            .
          </dd>
          <dt>Paid Shuttles</dt>
          <dd>
            Paid shuttle services, such as{" "}
            <ExternalLink href="https://www.supershuttle.com/">
              SuperShuttle
            </ExternalLink>
            , can also be booked ahead of time.
          </dd>
          <dt>Rideshares &amp; Taxis</dt>
          <dd>
            App-based car services including Uber and Lyft are readily available
            between SFO and San Mateo Marriott. Fares typically range between
            $18-25 each way.
          </dd>
        </dl>
      </section>
      <section className="c-article" aria-labelledby="other-airports">
        <HeadingSymbol symbol="airplane" id="other-airports">
          Other airports: SJC and OAK
        </HeadingSymbol>
        <p>
          If you&rsquo;re flying into{" "}
          <ExternalLink href="https://www.flysanjose.com/">
            San Jose International Airport (SJC)
          </ExternalLink>{" "}
          or{" "}
          <ExternalLink href="https://www.oaklandairport.com/">
            Oakland International Airport (OAK)
          </ExternalLink>
          , the distance from each airport is about 25 miles to our venue.
        </p>
        <p>
          Unfortunately, the hotel does not have a shuttle service to or from
          either of these airports. The best way to get to the San Mateo
          Marriott would be through a paid shuttle, rideshare, or rental car.
          Please note that the San Mateo-Hayward Bridge is a toll route when
          coming in from Oakland.
        </p>
      </section>
      <section className="c-article" aria-labelledby="driving-in">
        <HeadingSymbol symbol="travel-car" id="driving-in">
          Driving in
        </HeadingSymbol>
        <p>
          The San Mateo Marriott is located right off Highway 101. We have
          arranged for complimentary self-parking and discounted valet parking
          for our guests.
        </p>
      </section>
      <section className="c-article" aria-labelledby="hotel-block">
        <HeadingSymbol symbol="location-hotel" id="hotel-block">
          Hotel block
        </HeadingSymbol>
        <p>
          We have negotiated the best available rate for our guests who will be
          staying overnight at the venue.
        </p>
        <div className="my-4 w-full block">
          <ExternalLink
            href="https://www.marriott.com/event-reservations/reservation-link.mi?id=1561574654973&key=GRP&app=resvlink"
            className="c-button c-button-primary c-button-compact inline-block shadow-lg"
          >
            Book a room at the special rate
          </ExternalLink>
        </div>
        <p>
          Please use the above link to book your stay at the San Mateo Marriott
          by <strong>{data.site.siteMetadata.deadline}</strong>.
        </p>
        <p>
          Please don&rsquo;t hesitate to reach out to us (<ContactEmail />) if
          any questions come up about travel or booking your stay!
        </p>
      </section>
    </NavLayout>
  )
}
export default TravelPage
