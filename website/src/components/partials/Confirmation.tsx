import React from "react"
import Check from "./Check"

interface ConfirmationProps {
  className?: string
}

const Confirmation: React.FC<ConfirmationProps> = ({ className, children }) => {
  return (
    <div className={className} role="status">
      <Check />
      {children}
    </div>
  )
}
export default Confirmation
