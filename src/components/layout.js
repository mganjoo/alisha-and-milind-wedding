import React from "react"
import PropTypes from "prop-types"
import Header from "./Header"
import Helmet from "react-helmet"

const Layout = ({ children }) => {
  return (
    <>
      <Helmet>
        <body className="font-serif bg-orange-100 text-gray-900"></body>
      </Helmet>
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
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
