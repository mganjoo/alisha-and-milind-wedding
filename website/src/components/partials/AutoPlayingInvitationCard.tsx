import React, { useState, useEffect } from "react"
import InvitationCard from "./InvitationCard"

interface AutoPlayingInvitationCardProps {
  startDelayMs: number
}

const AutoPlayingInvitationCard: React.FC<AutoPlayingInvitationCardProps> = ({
  startDelayMs,
}) => {
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing) {
      const timerDelay = setTimeout(() => setPlaying(true), startDelayMs)
      return () => clearTimeout(timerDelay)
    }
    return
  }, [startDelayMs, playing])

  return <InvitationCard playing={playing} />
}

export default AutoPlayingInvitationCard
