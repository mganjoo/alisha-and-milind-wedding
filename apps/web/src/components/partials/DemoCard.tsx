import { useEffect, useState } from "react"
import type { PictureData } from "../../lib/picture"
import Emoji from "../ui/Emoji"
import InvitationCard from "./InvitationCard"

const secondaryClassName =
  "mx-1 px-1 text-secondary font-semibold dark:text-secondary-night hover:text-accent-hover dark:hover:text-accent-hover-night"

/** Envelope with play/pause and direction controls (no login). */
const DemoCard = ({ letter }: { letter: PictureData }) => {
  const [playing, setPlaying] = useState(false)
  const [reverse, setReverse] = useState(false)
  // The buttons are server-rendered; until React hydrates they'd silently
  // ignore taps, so render them disabled until then.
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  return (
    <>
      <div className="fixed inset-x-0 top-0 w-full flex justify-center items-center py-2 bg-background text-primary font-sans text-sm border-b border-subtle z-10 shadow-md opacity-75 dark:bg-background-night dark:text-primary-night dark:border-subtle-night">
        <button
          type="button"
          className={secondaryClassName}
          disabled={!hydrated}
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
          type="button"
          className={secondaryClassName}
          disabled={!hydrated}
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
      <InvitationCard
        letter={letter}
        playing={playing}
        reverse={reverse}
        testMode
      />
    </>
  )
}
export default DemoCard
