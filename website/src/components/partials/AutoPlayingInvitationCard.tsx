import React, { useState, useEffect } from "react"
import InvitationCard from "./InvitationCard"

interface AutoPlayingInvitationCardProps {
  /** Initial delay to start with. */
  startDelayMs: number
  skipAnimation?: boolean
}

const AutoPlayingInvitationCard: React.FC<AutoPlayingInvitationCardProps> = ({
  startDelayMs,
  skipAnimation,
}) => {
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing && !skipAnimation) {
      const timerDelay = setTimeout(() => setPlaying(true), startDelayMs)
      return () => clearTimeout(timerDelay)
    }
    return
  }, [startDelayMs, playing, skipAnimation])

  return <InvitationCard playing={playing} skipAnimation={skipAnimation} />
}

export default AutoPlayingInvitationCard
