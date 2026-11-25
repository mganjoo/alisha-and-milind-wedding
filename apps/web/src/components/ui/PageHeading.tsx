import type React from "react"

const PageHeading: React.FC<React.PropsWithChildren> = ({ children }) => (
  <h1 className="text-center text-3xl font-sans font-bold mb-6 sm:text-3xl">
    {children}
  </h1>
)

export default PageHeading
