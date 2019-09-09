import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"

const BaseLayout = ({ children }) => {
  return (
    <>
      <Helmet>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/favicon-outline.svg" color="#1a202c" />
        <body className="font-serif bg-orange-100 text-gray-900"></body>
      </Helmet>
      {children}
    </>
  )
}

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default BaseLayout
