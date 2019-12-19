import React, { useRef, useEffect } from "react"
import { scrollIntoView } from "../../utils/Utils"
import { useRegisteredRef } from "react-register-nodes"
import { useUID } from "react-uid"
import "./Alert.module.css"

const Alert: React.FC = ({ children }) => {
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
    </div>
  )
}

export default Alert
