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
      <main className="-mt-4 max-w-4xl flex flex-col mb-10 mx-auto sm:mt-0 sm:px-4">
        {children}
      </main>
    </BaseLayout>
  )
}
export default NavLayout
