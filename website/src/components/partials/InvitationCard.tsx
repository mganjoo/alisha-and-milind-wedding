import { animated, to, useSpring } from "@react-spring/web"
import classNames from "classnames"
import { graphql, useStaticQuery, Link } from "gatsby"
import BackgroundImage from "gatsby-background-image"
import { getImage } from "gatsby-plugin-image"
import { convertToBgImage } from "gbimage-bridge"
import React, { useContext, useEffect, useState } from "react"
import Div100vh from "react-div-100vh"
import { Helmet } from "react-helmet"
import { useStateList } from "../../utils/UtilHooks"
import Authenticated, { InvitationContext } from "./Authenticated"
import * as styles from "./InvitationCard.module.css"

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
        invitation: file(relativePath: { eq: "invitation/invitation.jpg" }) {
          childImageSharp {
            gatsbyImageData(layout: CONSTRAINED)
          }
        }
      }
    `
  )

  // First time the invitation mounts and starts playing, delay by N ms
  useEffect(() => {
    if (!started && playing && !reverse && state === "new") {
      // If not yet started, and we are playing in forward direction from the first state, start delay
      const timerDelay = setTimeout(() => {
        setStarted(true)
        moveNext()
      }, startDelayMs)
      return () => clearTimeout(timerDelay)
    } else if (started && playing && reverse && isAfter("letter-out")) {
      movePrevious()
    } else if (started && reverse && state === "new") {
      // If animation is reversed, and we are currently in the "new" state, reset
      setStarted(false)
      return
    }
    return
  }, [
    startDelayMs,
    started,
    playing,
    reverse,
    state,
    moveNext,
    movePrevious,
    isAfter,
  ])

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
    immediate: (key) => key === "flapZIndex" && !isAfter("flap-open"),
  })
  const linksProps = useSpring({ opacity: isAfter("letter-displayed") ? 1 : 0 })
  const bgImage = convertToBgImage(getImage(imageData.invitation))

  return (
    <div className={styles.outer_wrapper}>
      <div className={styles.wrapper}>
        <div className={styles.envelope}>
          <animated.div
            className={styles.flippable}
            style={{
              transform: to(
                [
                  props.envelopeRotateY,
                  props.letterProgress.to({
                    // rotateZ
                    range: [0, 0.5, 1],
                    output: [0, 0, -envelopeRotate],
                  }),
                  props.letterProgress.to({
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
              className={classNames(
                "flex items-center justify-center",
                styles.front,
                styles.front_base
              )}
            >
              <p className="font-script text-2xl tracking-wide text-amber-200 text-center sm:text-3xl">
                {invitation.partyName}
              </p>
            </div>
            <div className={classNames(styles.back, styles.back_base)}>
              <animated.div
                className={classNames(
                  "p-cover",
                  {
                    "shadow-lg": letterLoaded,
                  },
                  styles.letter
                )}
                style={{
                  transform: to(
                    [
                      props.letterProgress.to(interpolateYOffset),
                      props.letterProgress.to({
                        // rotateZ
                        range: [0, 0.5, 1],
                        output: [0, 0, -envelopeRotate + 90],
                      }),
                      props.letterProgress.to({
                        // scale
                        range: [0, 0.5, 1],
                        output: [1, 1, (1 / envelopeScale) * letterScale],
                      }),
                    ],
                    letterTransform
                  ),
                  zIndex: props.letterProgress.to((p) => (p > 0.5 ? 1 : 0)),
                }}
              >
                <BackgroundImage
                  style={{ width: "100%", height: "100%" }}
                  fadeIn={false}
                  onLoad={() => setLetterLoaded(true)}
                  {...bgImage}
                />
              </animated.div>
              <div
                className={classNames(
                  styles.flippable,
                  styles.back_bottom_flaps
                )}
              ></div>
              <animated.div
                className={styles.flippable}
                style={{
                  transform: props.flapRotateX.to(flapTransform),
                  transformOrigin: "center top",
                  zIndex: props.flapZIndex,
                }}
              >
                <div
                  className={classNames(styles.front, styles.front_flap)}
                ></div>
                <div
                  className={classNames(styles.back, styles.back_flap)}
                ></div>
              </animated.div>
            </div>
          </animated.div>
        </div>
      </div>
      <animated.div
        className="fixed inset-x-0 bottom-0 w-full flex justify-center items-center py-3 bg-background z-10 font-sans text-sm border-t border-subtle shadow-inner dark:bg-background-night dark:border-subtle-night print:hidden"
        style={linksProps}
      >
        <Link
          className="c-button c-button-primary c-button-compact"
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
  ...otherProps
}) => {
  return (
    <Div100vh className="flex w-screen h-screen justify-center items-center overflow-hidden print:hidden">
      <Helmet>
        <body className={styles.page_bg}></body>
      </Helmet>
      {testMode ? (
        <InvitationCardInner {...otherProps} />
      ) : (
        <Authenticated>
          <InvitationCardInner {...otherProps} />
        </Authenticated>
      )}
    </Div100vh>
  )
}

export default InvitationCard
