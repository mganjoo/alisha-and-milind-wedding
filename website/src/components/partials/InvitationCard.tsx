import React, { useContext, useEffect, useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { InvitationContext } from "./Authenticated"
import { useSpring, animated, interpolate } from "react-spring"
import { useStateList } from "../utils/UtilHooks"
import BackgroundImage from "gatsby-background-image"

type AnimationState = "new" | "flipped" | "flap-open" | "letter-out"

const orderedStates: AnimationState[] = [
  "new",
  "flipped",
  "flap-open",
  "letter-out",
]

interface InvitationCardProps {
  /**
   * Start animating a short delay after mount.
   */
  startAutomatically?: boolean

  /**
   * Normally, once the invitation starts playing, it cannot be paused.
   * This optional param can be useful for debugging purposes, by
   * allowing re-clicks that control pausing.
   */
  allowPause?: boolean

  /**
   * Optionally reverse the direction of animation.
   */
  reverse?: boolean

  /**
   * Callback for when the card is opened.
   */
  onOpen?: () => void
}

const startDelay = 2000 // in ms
const springConfig = { mass: 5, tension: 300, friction: 65, clamp: true }
const envelopeRotate = 25 // in degrees
const envelopeScale = 0.95
// Letter is originally in landscape (w = 1.4h). When rotated by 90deg,
// multiply by aspect ratio so that new width is same as original width
const letterScale = 1.4
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
  onOpen,
  startAutomatically = false,
  allowPause = false,
  reverse = false,
}) => {
  const { invitation } = useContext(InvitationContext)
  const [playing, setPlaying] = useState(false)
  const { movePrevious, moveNext, isAfter } = useStateList(orderedStates)
  const [letterLoaded, setLetterLoaded] = useState(false)
  const buttonClickable = letterLoaded && (!playing || allowPause)

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
    if (playing) {
      if (reverse) {
        movePrevious()
      } else {
        if (
          isAfter(orderedStates[orderedStates.length - 1]) &&
          onOpen !== undefined
        ) {
          onOpen()
        }
        moveNext()
      }
    }
  }

  useEffect(() => {
    if (startAutomatically && !playing && letterLoaded) {
      const timerDelay = setTimeout(() => setPlaying(true), startDelay)
      return () => clearTimeout(timerDelay)
    }
    return
  }, [startAutomatically, playing, letterLoaded])

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

  function handleClick(e: React.SyntheticEvent<HTMLDivElement>) {
    if (allowPause) {
      setPlaying(p => !p)
    } else {
      setPlaying(true)
    }
    if (e.currentTarget) {
      e.currentTarget.blur()
    }
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLDivElement>) {
    if (
      e.key === "Enter" ||
      e.key === " " ||
      e.key === "Return" ||
      e.key === "Spacebar"
    ) {
      handleClick(e)
    }
  }

  return (
    <div className="envelope-wrapper-dimensions">
      <div
        className="envelope-dimensions"
        role={buttonClickable ? "button" : undefined}
        tabIndex={buttonClickable ? 0 : undefined}
        onClick={buttonClickable ? handleClick : undefined}
        onKeyUp={buttonClickable ? handleKeyUp : undefined}
      >
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
            style={{ backgroundImage: "url('/invitation/front-base.png')" }}
          >
            <p className="font-serif text-lg text-yellow-200 sm:text-xl">
              {invitation.partyName}
            </p>
          </div>
          <div
            className="back"
            style={{ backgroundImage: "url('/invitation/back-base.png')" }}
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
                backgroundImage: "url('/invitation/back-bottom-flaps.png')",
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
  )
}
export default InvitationCard
