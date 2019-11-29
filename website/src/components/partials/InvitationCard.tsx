import React, { useContext, useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { InvitationContext } from "./Authenticated"
import { useSpring, animated, interpolate } from "react-spring"
import { useStateList } from "../../utils/UtilHooks"
import BackgroundImage from "gatsby-background-image"
import Div100vh from "react-div-100vh"
import Helmet from "react-helmet"
import { Link } from "gatsby"

type AnimationState =
  | "new"
  | "flipped"
  | "flap-open"
  | "letter-out"
  | "letter-displayed"

const orderedStates: AnimationState[] = [
  "new",
  "flipped",
  "flap-open",
  "letter-out",
  "letter-displayed",
]

interface InvitationCardProps {
  /**
   * Whether the card is currently animating.
   */
  playing: boolean

  /**
   * Optionally reverse the direction of animation.
   */
  reverse?: boolean
}

// Letter is originally in landscape (w = 1.4h). When rotated by 90deg,
// multiply by aspect ratio so that new width is same as original width
const letterScale = 1.4

const springConfig = { mass: 5, tension: 300, friction: 70, clamp: true }
const envelopeRotate = 25 // in degrees
const envelopeScale = 0.95
const letterPeakYOffset = 140 // in %
const letterFinalYOffset = 0 // in %

// Calculates translateY offset for letter over time. Parabolic curve with Y peaking at t = 0.5
const interpolateYOffset = (t: number) =>
  (4 * letterPeakYOffset + 2 * letterFinalYOffset) * t * t -
  (4 * letterPeakYOffset + letterFinalYOffset) * t
const envelopeTransform = (rotateY: any, rotateZ: any, scale: any) =>
  `perspective(55rem) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`
const letterTransform = (y: any, rotateZ: any, scale: any) =>
  `translateY(${y}%) rotateZ(${rotateZ}deg) scale(${scale})`
const flapTransform = (rotateX: any) =>
  `perspective(55rem) rotateX(${rotateX}deg)`

const InvitationCard: React.FC<InvitationCardProps> = ({
  playing,
  reverse = false,
}) => {
  const { invitation } = useContext(InvitationContext)
  const { movePrevious, moveNext, isAfter } = useStateList(orderedStates)
  const [letterLoaded, setLetterLoaded] = useState(false)

  const imageData = useStaticQuery(
    graphql`
      query {
        invitation: file(relativePath: { eq: "invitation.jpg" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `
  )

  function transition() {
    if (letterLoaded && playing) {
      if (reverse) {
        movePrevious()
      } else {
        moveNext()
      }
    }
  }

  const props = useSpring({
    envelopeRotateY: isAfter("flipped") ? 180 : 0,
    flapZIndex: isAfter("flap-open") ? -1 : 0,
    flapRotateX: isAfter("flap-open") ? 180 : 0,
    letterProgress: isAfter("letter-out") ? 1 : 0,
    config: springConfig,
    onRest: transition,
    // These are only useful if the animation is being reversed
    immediate: key => key === "flapZIndex" && !isAfter("flap-open"),
  })
  const linksProps = useSpring({ opacity: isAfter("letter-displayed") ? 1 : 0 })

  return (
    <>
      <animated.div
        className="fixed inset-x-0 top-0 w-full flex justify-center items-center py-2 bg-off-white z-10 font-sans text-sm border-b c-subtle-border shadow-md"
        style={linksProps}
      >
        <Link
          className="c-button c-button-primary py-1 px-2 mx-2 font-semibold"
          to="/"
        >
          Enter website
        </Link>
        <button
          className="mx-2 text-gray-800 font-semibold hover:text-orange-500"
          disabled
        >
          Download invitation
        </button>
      </animated.div>

      <Div100vh className="flex w-screen h-screen justify-center items-center overflow-hidden">
        <Helmet>
          <body className="invitation-page-bg text-gray-900 overflow-hidden"></body>
        </Helmet>
        <div className="envelope-outer-wrapper-dimensions">
          <div className="envelope-wrapper-dimensions">
            <div className="envelope-dimensions">
              <animated.div
                className="c-flippable"
                style={{
                  transform: interpolate(
                    [
                      props.envelopeRotateY,
                      props.letterProgress.interpolate({
                        // rotateZ
                        range: [0, 0.5, 1],
                        output: [0, 0, -envelopeRotate],
                      }),
                      props.letterProgress.interpolate({
                        // scale
                        range: [0, 0.5, 1],
                        output: [1, 1, envelopeScale],
                      }),
                    ],
                    envelopeTransform
                  ),
                }}
              >
                <div
                  className="front flex items-center justify-center"
                  style={{
                    backgroundImage: "url('/invitation/front-base.png')",
                  }}
                >
                  <p className="font-serif text-lg text-yellow-200 text-center sm:text-xl">
                    {invitation.partyName}
                  </p>
                </div>
                <div
                  className="back"
                  style={{
                    backgroundImage: "url('/invitation/back-base.png')",
                  }}
                >
                  <animated.div
                    className="letter-dimensions border border-orange-800 shadow-lg"
                    style={{
                      transform: interpolate(
                        [
                          props.letterProgress.interpolate(interpolateYOffset),
                          props.letterProgress.interpolate({
                            // rotateZ
                            range: [0, 0.5, 1],
                            output: [0, 0, -envelopeRotate + 90],
                          }),
                          props.letterProgress.interpolate({
                            // scale
                            range: [0, 0.5, 1],
                            output: [1, 1, (1 / envelopeScale) * letterScale],
                          }),
                        ],
                        letterTransform
                      ),
                      zIndex: props.letterProgress.interpolate(p =>
                        p > 0.5 ? 1 : 0
                      ),
                    }}
                  >
                    <BackgroundImage
                      style={{ width: "100%", height: "100%" }}
                      fluid={imageData.invitation.childImageSharp.fluid}
                      onLoad={() => setLetterLoaded(true)}
                    />
                  </animated.div>
                  <div
                    className="c-full-area"
                    style={{
                      backgroundImage:
                        "url('/invitation/back-bottom-flaps.png')",
                    }}
                  ></div>
                  <animated.div
                    className="c-flippable"
                    style={{
                      transform: props.flapRotateX.interpolate(flapTransform),
                      transformOrigin: "center top",
                      zIndex: props.flapZIndex,
                    }}
                  >
                    <div
                      className="front"
                      style={{
                        backgroundImage: "url('/invitation/front-flap.png')",
                      }}
                    ></div>
                    <div
                      className="back"
                      style={{
                        backgroundImage: "url('/invitation/back-flap.png')",
                      }}
                    ></div>
                  </animated.div>
                </div>
              </animated.div>
            </div>
          </div>
        </div>
      </Div100vh>
    </>
  )
}
export default InvitationCard
