import React from "react"
import PropTypes from "prop-types"
import Header from "./Header"
import BaseLayout from "./BaseLayout"

const NavLayout = ({ children }) => {
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

NavLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default NavLayout
