import classnames from "classnames"
import React from "react"
import styles from "./ButtonRow.module.css"

const ButtonRow: React.FC = ({ children }) => (
  <div
    className={classnames(
      "w-full flex flex-wrap flex-row-reverse justify-center py-4 px-2 -mb-4",
      styles.button_wrapper
    )}
  >
    {children}
  </div>
)

export default ButtonRow
