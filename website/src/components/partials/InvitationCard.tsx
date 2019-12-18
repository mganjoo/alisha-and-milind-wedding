import React, { useContext, useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { InvitationContext } from "./Authenticated"
import { useSpring, animated, interpolate } from "react-spring"
import { useStateList } from "../../utils/UtilHooks"
import BackgroundImage from "gatsby-background-image"
import Div100vh from "react-div-100vh"
import Helmet from "react-helmet"
import { Link } from "gatsby"
import "./InvitationCard.module.css"

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

  /**
   * Whether to skip through all the animation.
   */
  skipAnimation?: boolean
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
  skipAnimation = false,
}) => {
  const { invitation } = useContext(InvitationContext)
  const { movePrevious, moveNext, isAfter } = useStateList(
    orderedStates,
    skipAnimation ? "letter-displayed" : undefined
  )
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
    if (letterLoaded && (playing || skipAnimation)) {
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
      <Div100vh className="flex w-screen h-screen justify-center items-center overflow-hidden">
        <Helmet>
          <body
            className="text-gray-900 overflow-hidden"
            styleName="background"
          ></body>
        </Helmet>
        <div styleName="envelope-outer-wrapper-dimensions">
          <div styleName="envelope-wrapper-dimensions">
            <div styleName="envelope-dimensions">
              <animated.div
                styleName="flippable"
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
                  className="flex items-center justify-center"
                  styleName="front"
                  style={{
                    backgroundImage: "url('/invitation/front-base.png')",
                  }}
                >
                  <p className="font-serif text-lg text-yellow-200 text-center sm:text-xl">
                    {invitation.partyName}
                  </p>
                </div>
                <div
                  styleName="back"
                  style={{
                    backgroundImage: "url('/invitation/back-base.png')",
                  }}
                >
                  <animated.div
                    className="border border-orange-800 shadow-lg"
                    styleName="letter-dimensions"
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
                    styleName="full-area"
                    style={{
                      backgroundImage:
                        "url('/invitation/back-bottom-flaps.png')",
                    }}
                  ></div>
                  <animated.div
                    styleName="flippable"
                    style={{
                      transform: props.flapRotateX.interpolate(flapTransform),
                      transformOrigin: "center top",
                      zIndex: props.flapZIndex,
                    }}
                  >
                    <div
                      styleName="front"
                      style={{
                        backgroundImage: "url('/invitation/front-flap.png')",
                      }}
                    ></div>
                    <div
                      styleName="back"
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
      <animated.div
        className="fixed inset-x-0 bottom-0 w-full flex justify-center items-center py-3 bg-off-white z-10 font-sans text-sm border-t border-gray-subtle shadow-inner"
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
    </>
  )
}
export default InvitationCard
