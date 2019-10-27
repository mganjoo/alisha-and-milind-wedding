import React, { useState } from "react"
import InvitationCard from "../components/partials/InvitationCard"
import Button from "../components/ui/Button"

export default function DemoPage() {
  const [playing, setPlaying] = useState(false)
  const [direction, setDirection] = useState(1)
  return (
    <main className="bg-orange-200 h-screen flex items-center">
      <div className="flex flex-col px-2">
        <Button onClick={() => setPlaying(!playing)}>
          {playing ? "Pause" : "Play"}
        </Button>
        <Button onClick={() => setDirection(-direction)}>
          {direction > 0 ? "Switch to reverse" : "Switch to forward"}
        </Button>
      </div>
      <div className="ml-12">
        <InvitationCard playing={playing} reverse={direction < 0} />
      </div>
    </main>
  )
}
