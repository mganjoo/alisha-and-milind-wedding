import React, { useRef, useEffect } from "react"
import classnames from "classnames"
import { scrollIntoView } from "../../utils/Utils"
import { useRegisteredRef } from "react-register-nodes"
import { useUID } from "react-uid"

interface AlertProps {
  className?: string
}

const Alert: React.FC<AlertProps> = ({ className, children }) => {
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
      className={classnames("c-alert", className)}
      role="alert"
      ref={mounted.current ? laterRef : initialRef}
    >
      {children}
    </div>
  )
}
export default Alert
