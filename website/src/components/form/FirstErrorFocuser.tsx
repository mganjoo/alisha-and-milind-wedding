import { useFormikContext } from "formik"
import React, { useRef, useEffect, useState } from "react"
import { useOrderedNodes } from "react-register-nodes"
import { scrollIntoView } from "../../utils/Utils"

interface FirstErrorFocuserContextWrapper {
  /**
   * Consumers can call this method to imperiatively force focusing on error.
   */
  forceValidation: () => void
}

export const FirstErrorFocuserContext =
  React.createContext<FirstErrorFocuserContextWrapper>({
    forceValidation: () => {},
  })

const FirstErrorFocuser: React.FC = ({ children }) => {
  const formik = useFormikContext()
  const prevSubmitCountRef = useRef(formik.submitCount)
  const ordered = useOrderedNodes()
  const [validationForced, setValidationForced] = useState(false)
  const context = {
    forceValidation: () => setValidationForced(true),
  }

  useEffect(() => {
    if (
      (validationForced || prevSubmitCountRef.current !== formik.submitCount) &&
      !formik.isValid &&
      ordered.length > 0
    ) {
      scrollIntoView(ordered[0])
      ordered[0].focus()
      prevSubmitCountRef.current = formik.submitCount
      setValidationForced(false)
    }
  }, [formik.isValid, formik.submitCount, ordered, validationForced])

  return (
    <FirstErrorFocuserContext.Provider value={context}>
      {children}
    </FirstErrorFocuserContext.Provider>
  )
}
export default FirstErrorFocuser
