import React from "react"
import classnames from "classnames"
import "./ButtonRow.module.css"

interface ButtonRowProps {
  full?: boolean
  shadow?: boolean
}

const ButtonRow: React.FC<ButtonRowProps> = ({ children, full, shadow }) => (
  <div
    className="w-full flex flex-wrap flex-row-reverse justify-center py-4 px-2"
    styleName={classnames({ full, shadow })}
  >
    {children}
  </div>
)

export default ButtonRow
