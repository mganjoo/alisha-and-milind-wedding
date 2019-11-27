import React, { useState } from "react"
import InvitationCard from "../components/partials/InvitationCard"
import Button from "../components/ui/Button"
import Helmet from "react-helmet"

const DemoPage: React.FC = () => {
  const [direction, setDirection] = useState(1)
  return (
    <>
      <Helmet>
        <body className="bg-off-white overflow-x-hidden"></body>
      </Helmet>
      <main className="flex flex-col">
        <div className="flex justify-start py-4">
          <Button onClick={() => setDirection(-direction)}>
            Switch: {direction > 0 ? "reverse" : "forward"}
          </Button>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <InvitationCard allowPause reverse={direction < 0} />
        </div>
      </main>
    </>
  )
}
export default DemoPage
