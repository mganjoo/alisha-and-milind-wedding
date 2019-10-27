import React, { useContext } from "react"
import { InvitationContext } from "./Authenticated"
import { useSpring, animated, interpolate } from "react-spring"
import { useStateList } from "../utils/UtilHooks"

type AnimationState =
  | "new"
  | "flipped"
  | "flap-open"
  | "letter-out"
  | "letter-focused"

const orderedStates: AnimationState[] = [
  "new",
  "flipped",
  "flap-open",
  "letter-out",
  "letter-focused",
]

interface InvitationCardProps {
  playing?: boolean
  reverse?: boolean
}

export default function InvitationCard({
  playing = false,
  reverse = false,
}: InvitationCardProps) {
  const invitation = useContext(InvitationContext)
  const { movePrevious, moveNext, isAfter } = useStateList(orderedStates)

  const springConfig = { mass: 5, tension: 500, friction: 80 }
  const envelopeRotate = 25 // in degrees
  const letterTranslateUp = 30 // in rem; must be greater than height of envelope

  const envelopeTransform = (rotateY: any, rotateZ: any, scale: any) =>
    `perspective(35rem) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`
  const letterTransform = (y: any, rotateZ: any, scale: any) =>
    `translateY(${y}rem) rotateZ(${rotateZ}deg) scale(${scale})`
  const flapTransform = (rotateX: any) => `rotateX(${rotateX}deg)`

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
    envelopeRotateZ: isAfter("letter-focused") ? -envelopeRotate : 0,
    envelopeScale: isAfter("letter-focused") ? 0.8 : 1,
    flapZIndex: isAfter("flap-open") ? -1 : 0,
    flapRotateX: isAfter("flap-open") ? -180 : 0,
    letterZIndex: isAfter("letter-out") ? 1 : 0,
    letterY: isAfter("letter-focused")
      ? 0
      : isAfter("letter-out")
      ? -letterTranslateUp
      : 0,
    letterScale: isAfter("letter-focused") ? 1.25 : 1,
    letterRotateZ: isAfter("letter-focused") ? -envelopeRotate : 0,
    config: springConfig,
    onRest: transition,
    // These are only useful if the animation is being reversed
    immediate: key =>
      (key === "flapZIndex" && !isAfter("flap-open")) ||
      (key === "letterZIndex" && !isAfter("letter-out")),
  })

  return (
    <animated.div
      className="envelope"
      style={{
        transform: interpolate(
          [props.envelopeRotateY, props.envelopeRotateZ, props.envelopeScale],
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
              [props.letterY, props.letterRotateZ, props.letterScale],
              letterTransform
            ),
            zIndex: props.letterZIndex,
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
            transform: interpolate([props.flapRotateX], flapTransform),
            zIndex: props.flapZIndex,
          }}
        ></animated.div>
      </div>
    </animated.div>
  )
}
