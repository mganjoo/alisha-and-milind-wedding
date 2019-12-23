import { graphql, useStaticQuery, Link } from "gatsby"
import BackgroundImage from "gatsby-background-image"
import React, { useContext, useEffect, useState } from "react"
import Div100vh from "react-div-100vh"
import Helmet from "react-helmet"
import { useSpring, animated, interpolate } from "react-spring"
import { useStateList } from "../../utils/UtilHooks"
import Authenticated, { InvitationContext } from "./Authenticated"
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

interface InvitationCardInnerProps {
  /**
   * Whether the card is currently animating.
   */
  playing: boolean

  /**
   * Start animating after given duration in ms.
   */
  startDelayMs?: number

  /**
   * Optionally reverse the direction of animation.
   */
  reverse?: boolean

  /**
   * Whether to skip through all the animation.
   */
  skipAnimation?: boolean

  /**
   * Optional link for navigation from card to main website. By default, links to home page.
   */
  navLink?: {
    label: string
    url: string
  }
}

interface InvitationCardProps extends InvitationCardInnerProps {
  /**
   * If true, shows test invitation to user without authenticating.
   */
  testMode?: boolean

  /**
   * Initial code to use for authentication, if any.
   */
  initialCode?: string
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

const InvitationCardInner: React.FC<InvitationCardInnerProps> = ({
  playing,
  navLink,
  startDelayMs = 0,
  reverse = false,
  skipAnimation = false,
}) => {
  const { invitation } = useContext(InvitationContext)
  const { state, movePrevious, moveNext, isAfter } = useStateList(
    orderedStates,
    skipAnimation ? "letter-displayed" : undefined
  )
  const [letterLoaded, setLetterLoaded] = useState(false)
  const [started, setStarted] = useState(false)

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

  // First time the invitation mounts and starts playing, delay by N ms
  useEffect(() => {
    if (!started && playing && !reverse && state === "new") {
      // If not yet started, and we are playing in forward direction from the first state, start delay
      const timerDelay = setTimeout(() => setStarted(true), startDelayMs)
      return () => clearTimeout(timerDelay)
    } else if (started && reverse && state === "new") {
      // If animation is reversed, and we are currently in the "new" state, reset
      setStarted(false)
      return
    }
    return
  }, [startDelayMs, started, playing, reverse, skipAnimation, state])

  function transition() {
    if (letterLoaded && (skipAnimation || (playing && started))) {
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
    <div styleName="outer-wrapper">
      <div styleName="wrapper">
        <div styleName="envelope">
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
                className="border border-orange-800 shadow-lg p-cover"
                styleName="letter"
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
                  backgroundImage: "url('/invitation/back-bottom-flaps.png')",
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
      <animated.div
        className="fixed inset-x-0 bottom-0 w-full flex justify-center items-center py-3 bg-off-white z-10 font-sans text-sm border-t border-gray-subtle shadow-inner"
        style={linksProps}
      >
        <Link
          className="c-button c-button-primary py-1 px-2 mx-2 font-semibold"
          to={navLink ? navLink.url : "/"}
        >
          {navLink ? navLink.label : "Enter website"}
        </Link>
      </animated.div>
    </div>
  )
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  testMode,
  initialCode,
  ...otherProps
}) => {
  return (
    <Div100vh className="flex w-screen h-screen justify-center items-center overflow-hidden">
      <Helmet>
        <body
          className="text-gray-900 overflow-hidden"
          styleName="page-bg"
        ></body>
      </Helmet>
      {testMode ? (
        <InvitationCardInner {...otherProps} />
      ) : (
        <Authenticated initialCode={initialCode}>
          <InvitationCardInner {...otherProps} />
        </Authenticated>
      )}
    </Div100vh>
  )
}

export default InvitationCard
