import React, { useState } from "react"
import InvitationCard from "../components/partials/InvitationCard"
import BaseLayout from "../components/layout/BaseLayout"
import Emoji from "../components/ui/Emoji"

const DemoPage: React.FC = () => {
  const [playing, setPlaying] = useState(false)
  const [reverse, setReverse] = useState(false)

  const secondaryClassName =
    "mx-1 px-1 text-gray-800 font-semibold hover:text-orange-500"
  return (
    <BaseLayout>
      <div className="fixed inset-x-0 top-0 w-full flex justify-center items-center py-2 bg-off-white text-gray-900 font-sans text-sm border-b border-gray-subtle z-10 shadow-md opacity-75">
        <button
          className={secondaryClassName}
          onClick={() => setPlaying(!playing)}
        >
          {!playing ? (
            <>
              <Emoji className="mr-1" symbol="▶️" /> Play
            </>
          ) : (
            <>
              <Emoji className="mr-1" symbol="⏸️" /> Pause
            </>
          )}
        </button>
        <button
          className={secondaryClassName}
          onClick={() => setReverse(!reverse)}
        >
          Switch Direction{" "}
          {reverse ? (
            <Emoji label="Reverse" symbol="⬅️" />
          ) : (
            <Emoji label="Forward" symbol="➡️" />
          )}
        </button>
      </div>
      <InvitationCard playing={playing} reverse={reverse} testMode />
    </BaseLayout>
  )
}
export default DemoPage
