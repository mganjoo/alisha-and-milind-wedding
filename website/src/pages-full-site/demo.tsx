import React, { useState } from "react"
import InvitationCard from "../components/partials/InvitationCard"
import Button from "../components/ui/Button"
import Helmet from "react-helmet"

export default function DemoPage() {
  const [playing, setPlaying] = useState(false)
  const [direction, setDirection] = useState(1)
  return (
    <>
      <Helmet>
        <body className="bg-orange-200"></body>
      </Helmet>
      <main className="flex flex-col">
        <div className="flex justify-start py-4">
          <Button onClick={() => setPlaying(!playing)}>
            {playing ? "Pause" : "Play"}
          </Button>
          <Button className="ml-4" onClick={() => setDirection(-direction)}>
            Switch: {direction > 0 ? "reverse" : "forward"}
          </Button>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <InvitationCard playing={playing} reverse={direction < 0} />
        </div>
      </main>
    </>
  )
}
