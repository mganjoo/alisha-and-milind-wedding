import React from "react"
import Header from "../ui/Header"
import BaseLayout from "./BaseLayout"

const NavLayout: React.FC = ({ children }) => {
  return (
    <BaseLayout>
      <Header
        links={[
          { text: "Our Story", to: "/our-story" },
          { text: "Events", to: "/events" },
          { text: "Travel", to: "/travel" },
          { text: "FAQ", to: "/faq" },
          { text: "RSVP", to: "/rsvp" },
        ]}
      />
      <div className="sm:mt-4">
        <main>{children}</main>
      </div>
    </BaseLayout>
  )
}
export default NavLayout
