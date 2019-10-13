import React from "react"
import Header from "../ui/Header"
import BaseLayout from "./BaseLayout"

const NavLayout: React.FC = ({ children }) => {
  return (
    <BaseLayout>
      <Header
        links={[
          { text: "Our Story", to: "/full/our-story" },
          { text: "Events", to: "/full/events" },
          { text: "Travel", to: "/full/travel" },
          { text: "FAQ", to: "/full/faq" },
          { text: "RSVP", to: "/full/rsvp" },
        ]}
      />
      <div className="sm:mt-4">
        <main>{children}</main>
      </div>
    </BaseLayout>
  )
}
export default NavLayout
