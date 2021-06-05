import classnames from "classnames"
import React, { useRef, useEffect } from "react"
import { useRegisteredRef } from "react-register-nodes"
import { useUID } from "react-uid"
import { scrollIntoView } from "../../utils/Utils"
import styles from "./Alert.module.css"

interface AlertProps {
  action?: {
    label: string
    onClick: () => void
  }
  // Whether this alert is a permanent informational alert
  isInfo?: boolean
}

const Alert: React.FC<AlertProps> = ({ children, action, isInfo }) => {
  const initialRef = useRef<HTMLDivElement>(null)
  const mounted = useRef(!!isInfo || false)
  const refName = useUID()
  const laterRef = useRegisteredRef(refName)

  useEffect(() => {
    // Scroll alert into view on mount
    if (!mounted.current && initialRef.current) {
      scrollIntoView(initialRef.current)
      mounted.current = true
    }
  })

  return (
    <div
      role="alert"
      className={classnames(
        "block my-4 px-3 py-2 border border-l-4 text-left font-sans text-sm shadow-md print:bg-transparent print:border-gray-subtle print:text-gray-900",
        isInfo
          ? "bg-orange-200 border-orange-400 text-orange-800"
          : "bg-red-100 border-red-400 text-red-800",
        styles.alert_wrapper
      )}
      ref={mounted.current ? laterRef : initialRef}
    >
      {children}
      {action && (
        <div className="my-2">
          <button onClick={action.onClick}>{action.label}</button>
        </div>
      )}
    </div>
  )
}

export default Alert
