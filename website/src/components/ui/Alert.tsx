import React, { useRef, useEffect } from "react"
import { useRegisteredRef } from "react-register-nodes"
import { useUID } from "react-uid"
import { scrollIntoView } from "../../utils/Utils"
import "./Alert.module.css"

interface AlertProps {
  action?: {
    label: string
    onClick: () => void
  }
}

const Alert: React.FC<AlertProps> = ({ children, action }) => {
  const initialRef = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)
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
      className="block my-4 px-3 py-2 bg-red-100 border border-l-4 border-invalid text-left text-red-800 font-sans text-sm shadow-md"
      styleName="alert"
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
