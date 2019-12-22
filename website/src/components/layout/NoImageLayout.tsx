import React from "react"
import NavLayout from "./NavLayout"

const NoImageLayout: React.FC = ({ children }) => {
  return (
    <NavLayout>
      <div className="mt-4 px-8 sm:px-0">{children}</div>
    </NavLayout>
  )
}
export default NoImageLayout
