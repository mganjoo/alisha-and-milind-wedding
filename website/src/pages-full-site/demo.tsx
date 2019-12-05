import React, { useState } from "react"
import InvitationCard from "../components/partials/InvitationCard"
import BaseLayout from "../components/layout/BaseLayout"

const DemoPage: React.FC = () => {
  const [playing, setPlaying] = useState(false)
  const [reverse, setReverse] = useState(false)

  const secondaryClassName =
    "mx-1 px-1 text-gray-800 font-semibold hover:text-orange-500"
  return (
    <BaseLayout>
      <div className="fixed inset-x-0 top-0 w-full flex justify-center items-center py-2 bg-off-white text-gray-900 font-sans text-sm border-b c-subtle-border z-10 shadow-md opacity-75">
        <button
          className={secondaryClassName}
          onClick={() => setPlaying(!playing)}
        >
          {!playing ? (
            <>
              <span aria-hidden="true" className="mr-1">
                ▶️
              </span>{" "}
              Play
            </>
          ) : (
            <>
              <span aria-hidden="true" className="mr-1">
                ⏸️
              </span>{" "}
              Pause
            </>
          )}
        </button>
        <button
          className={secondaryClassName}
          onClick={() => setReverse(!reverse)}
        >
          Switch Direction{" "}
          {reverse ? (
            <span role="img" aria-label="Reverse">
              ⬅️
            </span>
          ) : (
            <span role="img" aria-label="Forward">
              ➡️
            </span>
          )}
        </button>
      </div>
      <InvitationCard playing={playing} reverse={reverse} />
    </BaseLayout>
  )
}
export default DemoPage
