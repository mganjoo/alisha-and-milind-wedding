import React from "react"
import PropTypes from "prop-types"
import Header from "./header"
import Helmet from "react-helmet"

const Layout = ({ children }) => {
  return (
    <>
      <Helmet>
        <body className="font-serif bg-orange-100 text-gray-900"></body>
      </Helmet>
      <Header />
      <div>
        <main>{children}</main>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
