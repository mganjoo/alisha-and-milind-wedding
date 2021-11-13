import React, { useState } from "react"
import BaseLayout from "../components/layout/BaseLayout"
import InvitationCard from "../components/partials/InvitationCard"
import Emoji from "../components/ui/Emoji"

const DemoCardPage: React.FC = () => {
  const [playing, setPlaying] = useState(false)
  const [reverse, setReverse] = useState(false)

  const secondaryClassName =
    "mx-1 px-1 text-secondary font-semibold dark:text-secondary-night hover:text-accent-hover dark:hover:text-accent-hover-night"
  return (
    <BaseLayout>
      <div className="fixed inset-x-0 top-0 w-full flex justify-center items-center py-2 bg-background text-primary font-sans text-sm border-b border-subtle z-10 shadow-md opacity-75 dark:bg-background-night dark:text-primary-night dark:border-subtle-night">
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
export default DemoCardPage
