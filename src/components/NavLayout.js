import React from "react"
import PropTypes from "prop-types"
import Header from "./Header"
import BaseLayout from "./BaseLayout"

const NavLayout = ({ children }) => {
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

NavLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default NavLayout
