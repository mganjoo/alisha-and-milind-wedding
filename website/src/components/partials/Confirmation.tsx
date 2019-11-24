import React from "react"

interface ConfirmationProps {
  className?: string
}

const Confirmation: React.FC<ConfirmationProps> = ({ className, children }) => {
  return (
    <div className={className} role="status">
      {children}
    </div>
  )
}
export default Confirmation
