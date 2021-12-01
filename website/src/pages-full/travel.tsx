import { useStaticQuery, graphql } from "gatsby"
import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import Authenticated from "../components/partials/Authenticated"
import ContactEmail from "../components/partials/ContactEmail"
import ExternalLink from "../components/ui/ExternalLink"
import IframeContainer from "../components/ui/IframeContainer"
import PageHeading from "../components/ui/PageHeading"
import Symbol, { SymbolName } from "../components/ui/Symbol"
import { WeddingMetadataContext } from "../utils/WeddingMetadataContext"

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
      }
    `
  )
  return (
    <NavLayout
      heroImage={data.heroImage.childImageSharp.gatsbyImageData}
      alt="Alisha and Milind in front of a red sandstone backdrop. Alisha is pointing at something in the distance and Milind looking on."
    >
      <SEO
        title="Travel & Hotel"
        image="/meta-travel-hero.jpg"
        description="Venue information, recommended airport and details about the hotel block."
      />
      <PageHeading>Travel &amp; Hotel</PageHeading>
      <WeddingMetadataContext.Consumer>
        {(value) => (
          <Authenticated>
            <section
              className="c-shadow-box mb-8 sm:flex sm:items-center"
              aria-labelledby="venue-heading"
              aria-describedby="venue-description"
            >
              <div className="font-sans text-lg mb-4 sm:mb-0 sm:w-1/2 sm:flex sm:flex-col sm:items-center">
                <div>
                  <h2
                    className="text-xl font-semibold mb-1 dark:font-bold"
                    id="venue-heading"
                  >
                    Venue
                  </h2>
                  <div id="venue-description">
                    {value?.mainVenue.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="sm:w-1/2">
                <IframeContainer
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3220.6179385788037!2d-115.2933054847275!3d36.175850780081944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c8bf8c790d8827%3A0x784fdcab011408d2!2sJW%20Marriott%20Las%20Vegas%20Resort%20%26%20Spa!5e0!3m2!1sen!2sus!4v1636839408497!5m2!1sen!2sus"
                  width={400}
                  height={300}
                  title={`Wedding Venue: ${value?.mainVenue[0]}`}
                  containerClassName="bg-background text-primary dark:bg-background-night dark:text-primary-night"
                />
              </div>
            </section>
            <section className="c-article" aria-labelledby="hotel-block">
              <HeadingSymbol symbol="location-hotel" id="hotel-block">
                Hotel block
              </HeadingSymbol>
              <p>
                For our guests who will be staying overnight at the venue,
                please use the link below for the wedding event rate. Please
                book your stay by <strong>{value?.bookingDeadline}</strong> to
                guarantee room availability at the special rate.
              </p>
              <div className="my-4 w-full block">
                <ExternalLink
                  href="https://www.marriott.com/events/start.mi?id=1561574654973&key=GRP"
                  className="c-button c-button-primary c-button-comfortable inline-block shadow-lg"
                >
                  Book a room at the special rate
                </ExternalLink>
              </div>
            </section>
            <section
              className="c-article"
              aria-labelledby="recommended-airport"
            >
              <HeadingSymbol symbol="airplane" id="recommended-airport">
                Recommended airport: LAS
              </HeadingSymbol>
              <p>
                For our friends and family flying in for the festivities, the
                closest airport is{" "}
                <ExternalLink href="https://www.las-vegas-airport.com/">
                  Las Vegas McCarran International Airport (LAS)
                </ExternalLink>
                , which is about 16 miles from the hotel.
              </p>
              <p>
                App-based car services including Lyft and Uber are readily
                available between LAS and JW Marriott. Fares typically range
                between $30-40 each way for rideshares. Estimated taxi fare is
                around $60 each way.
              </p>
              <p>
                To easily get to the hotel registration desk, you would want to
                be dropped off at <strong>Spa Tower</strong>.
              </p>
            </section>
            <section className="c-article" aria-labelledby="driving-in">
              <HeadingSymbol symbol="travel-car" id="driving-in">
                Driving in
              </HeadingSymbol>
              <p>
                The JW Marriott is located on N Rampart Blvd, off US 95. Valet
                parking (complimentary for overnight guests) and self-parking
                (complimentary for all) is available at the venue.
              </p>
              <p>
                If you are checking into the hotel, the registration desk is
                closest to <strong>Spa Tower</strong>. If you are joining us for
                the event directly, head on over to <strong>Palm Tower</strong>.
              </p>
              <p>
                Do not hesitate to reach out to us (
                <ContactEmail />) if any questions come up about travel or
                booking your stay!
              </p>
            </section>
          </Authenticated>
        )}
      </WeddingMetadataContext.Consumer>
    </NavLayout>
  )
}
export default TravelPage
