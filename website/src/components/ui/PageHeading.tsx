import React from "react"

const PageHeading: React.FC = ({ children }) => (
  <h1 className="text-center text-3xl font-sans font-bold mb-4 sm:text-4xl">
    {children}
  </h1>
)

export default PageHeading