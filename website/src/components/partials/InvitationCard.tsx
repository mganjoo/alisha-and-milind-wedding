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
const letterPeakYOffset = 30 // in rem
const letterFinalYOffset = 2 // in rem

// Calculates translateY offset for letter over time. Parabolic curve with Y peaking at t = 0.5
const interpolateYOffset = (t: number) =>
  (4 * letterPeakYOffset + 2 * letterFinalYOffset) * t * t -
  (4 * letterPeakYOffset + letterFinalYOffset) * t
const envelopeTransform = (rotateY: any, rotateZ: any, scale: any) =>
  `perspective(35rem) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`
const letterTransform = (y: any, rotateZ: any, scale: any) =>
  `translateY(${y}rem) rotateZ(${rotateZ}deg) scale(${scale})`
const flapTransform = (rotateX: any) => `rotateX(${rotateX}deg)`

export default function InvitationCard({
  playing = false,
  reverse = false,
}: InvitationCardProps) {
  const invitation = useContext(InvitationContext)
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
    envelopeRotateY: isAfter("flipped") ? -180 : 0,
    flapZIndex: isAfter("flap-open") ? -1 : 0,
    flapRotateX: isAfter("flap-open") ? -180 : 0,
    letterProgress: isAfter("letter-out") ? 1 : 0,
    config: springConfig,
    onRest: transition,
    // These are only useful if the animation is being reversed
    immediate: key => key === "flapZIndex" && !isAfter("flap-open"),
  })

  return (
    <animated.div
      className="envelope"
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
      <div className="front">
        <p className="address">{invitation.partyName}</p>
      </div>
      <div className="back">
        <animated.div
          className="letter"
          style={{
            transform: interpolate(
              [
                props.letterProgress.interpolate(interpolateYOffset),
                props.letterProgress.interpolate({
                  // rotateZ
                  range: [0, 0.5, 1],
                  output: [0, 0, -envelopeRotate],
                }),
                props.letterProgress.interpolate({
                  // scale
                  range: [0, 0.5, 1],
                  output: [1, 1, 1 / envelopeScale],
                }),
              ],
              letterTransform
            ),
            zIndex: props.letterProgress.interpolate(p => (p > 0.5 ? 1 : 0)),
          }}
        >
          <p>Welcome to our wedding</p>
        </animated.div>
        <div className="flap left-flap"></div>
        <div className="flap right-flap"></div>
        <div className="flap bottom-flap"></div>
        <animated.div
          className="flap top-flap"
          style={{
            transform: props.flapRotateX.interpolate(flapTransform),
            zIndex: props.flapZIndex,
          }}
        ></animated.div>
      </div>
    </animated.div>
  )
}
