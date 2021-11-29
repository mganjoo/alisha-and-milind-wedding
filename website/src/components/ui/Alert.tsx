import classnames from "classnames"
import React, { useRef, useEffect } from "react"
import { useUID } from "react-uid"
import { useRegisteredRef } from "../../utils/RegisterNodes"
import { scrollIntoView } from "../../utils/Utils"

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
    // Scroll non-info alert into view on mount
    if (!isInfo && !mounted.current && initialRef.current) {
      scrollIntoView(initialRef.current)
      mounted.current = true
    }
  })

  return (
    <div
      role="alert"
      className={classnames(
        "block mb-6 px-3 py-2 border border-l-4 text-left font-sans text-sm shadow-md dark:border-transparent print:bg-transparent print:border-subtle print:text-primary-print",
        isInfo
          ? "bg-amber-200 border-amber-500 text-amber-900 dark:bg-amber-700 dark:text-gray-100"
          : "bg-red-200 border-red-400 text-red-900 dark:brightness-90 dark:bg-rose-700 dark:text-rose-100",
        "c-alert-wrapper"
      )}
      ref={mounted.current && !isInfo ? laterRef : initialRef}
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
