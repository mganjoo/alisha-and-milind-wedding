import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react"
import { useFormContext } from "react-hook-form"
import { useOrderedNodes } from "../../utils/RegisterNodes"
import { scrollIntoView } from "../../utils/Utils"

interface FirstErrorFocuserContextWrapper {
  /**
   * Consumers can call this method to imperiatively force focusing on error.
   */
  forceValidation: () => void
}

export const FirstErrorFocuserContext =
  createContext<FirstErrorFocuserContextWrapper>({
    forceValidation: () => {},
  })

/**
 * After a failed submit, scrolls to and focuses the first (in DOM order)
 * field that registered itself as invalid via `useRegisteredRef`.
 */
const FirstErrorFocuser = ({ children }: PropsWithChildren) => {
  const {
    formState: { submitCount, errors },
  } = useFormContext()
  const isValid = Object.keys(errors).length === 0
  const prevSubmitCountRef = useRef(submitCount)
  const ordered = useOrderedNodes()
  const [validationForced, setValidationForced] = useState(false)
  const context = {
    forceValidation: () => setValidationForced(true),
  }

  useEffect(() => {
    if (
      (validationForced || prevSubmitCountRef.current !== submitCount) &&
      !isValid &&
      ordered.length > 0
    ) {
      scrollIntoView(ordered[0])
      ordered[0].focus()
      prevSubmitCountRef.current = submitCount
      setValidationForced(false)
    }
  }, [isValid, submitCount, ordered, validationForced])

  return (
    <FirstErrorFocuserContext.Provider value={context}>
      {children}
    </FirstErrorFocuserContext.Provider>
  )
}
export default FirstErrorFocuser
