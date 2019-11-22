import React, { useContext } from "react"
import { InvitationContext } from "./Authenticated"
import { useSpring, animated, interpolate } from "react-spring"
import { useStateList } from "../utils/UtilHooks"

type AnimationState = "new" | "flipped" | "flap-open" | "letter-out"

const orderedStates: AnimationState[] = [
  "new",
  "flipped",
  "flap-open",
  "letter-out",
]

interface InvitationCardProps {
  playing?: boolean
  reverse?: boolean
}

const springConfig = { mass: 5, tension: 300, friction: 80, clamp: true }
const envelopeRotate = 25 // in degrees
const envelopeScale = 0.8
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
  playing = false,
  reverse = false,
}) => {
  const { invitation } = useContext(InvitationContext)
  const { movePrevious, moveNext, isAfter } = useStateList(orderedStates)

  function transition() {
    if (playing) {
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

  return (
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
            style={{ backgroundImage: "url('/invitation/front-base.png')" }}
          >
            <p className="font-serif text-lg text-gray-900 tracking-tight">
              {invitation.partyName}
            </p>
          </div>
          <div
            className="back"
            style={{ backgroundImage: "url('/invitation/back-base.png')" }}
          >
            <animated.div
              className="letter-dimensions bg-off-white rounded-sm shadow-md border border-orange-200 px-3 py-8"
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
                      output: [1, 1, 1 / envelopeScale],
                    }),
                  ],
                  letterTransform
                ),
                zIndex: props.letterProgress.interpolate(p =>
                  p > 0.5 ? 1 : 0
                ),
              }}
            >
              <p>Welcome to our wedding</p>
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
