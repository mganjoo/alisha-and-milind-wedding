import React, { useState, useEffect } from "react"
import InvitationCard from "./InvitationCard"
import { Link } from "gatsby"
import { useSpring, animated } from "react-spring"
import Helmet from "react-helmet"
import Div100vh from "react-div-100vh"

interface FullPageInvitationProps {
  startDelay?: number | undefined
  showDemoBar?: boolean
}

const FullPageInvitation: React.FC<FullPageInvitationProps> = ({
  startDelay,
  showDemoBar,
}) => {
  const [playing, setPlaying] = useState(false)
  const [reverse, setReverse] = useState(false)
  const [showLinks, setShowLinks] = useState(false)
  const linksProps = useSpring({ opacity: showLinks ? 1 : 0 })
  const secondaryClassName =
    "mx-2 text-gray-800 font-semibold hover:text-orange-500"

  useEffect(() => {
    if (startDelay !== undefined && !playing) {
      const timerDelay = setTimeout(() => setPlaying(true), startDelay)
      return () => clearTimeout(timerDelay)
    }
    return
  }, [startDelay, playing])

  return (
    <>
      <Helmet>
        <body className="invitation-page-bg text-gray-900 overflow-hidden"></body>
      </Helmet>
      <animated.div
        className="fixed inset-x-0 top-0 w-full flex justify-center items-center py-2 bg-off-white z-10 font-sans text-sm border-b c-subtle-border shadow-md"
        style={linksProps}
      >
        <Link
          className="c-button c-button-primary py-1 px-2 mx-2 font-semibold"
          to="/"
        >
          Enter website
        </Link>
        <button className={secondaryClassName} disabled>
          Download invitation
        </button>
      </animated.div>
      <Div100vh className="flex w-screen h-screen justify-center items-center overflow-hidden">
        <div className="envelope-outer-wrapper-dimensions">
          <InvitationCard
            playing={playing}
            reverse={reverse}
            onOpen={() => setShowLinks(true)}
          />
        </div>
      </Div100vh>
      {showDemoBar && (
        <div className="fixed inset-x-0 bottom-0 w-full flex justify-center items-center py-3 bg-off-white text-gray-900 font-sans text-sm border-t-2 border-gray-600 z-10">
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
      )}
    </>
  )
}
export default FullPageInvitation
