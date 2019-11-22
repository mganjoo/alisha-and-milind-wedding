import React, { useRef, useEffect } from "react"
import { useOrderedNodes } from "react-register-nodes"
import scrollIntoView from "scroll-into-view-if-needed"
import { useFormikContext } from "formik"

const FirstErrorFocuser: React.FC = ({ children }) => {
  const formik = useFormikContext()
  const prevSubmitCountRef = useRef(formik.submitCount)
  const ordered = useOrderedNodes()

  useEffect(() => {
    if (
      prevSubmitCountRef.current !== formik.submitCount &&
      !formik.isValid &&
      ordered.length > 0
    ) {
      prevSubmitCountRef.current = formik.submitCount
      scrollIntoView(ordered[0])
      ordered[0].focus()
    }
  }, [formik.isValid, formik.submitCount, ordered])

  return <>{children}</>
}
export default FirstErrorFocuser
