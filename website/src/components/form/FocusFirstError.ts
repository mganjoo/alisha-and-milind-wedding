import { useRef, useEffect } from "react"
import { FormikErrors } from "formik"

interface FormikPartialType {
  submitCount: number
  isValid: boolean
  errors: FormikErrors<any>
}

export function useFocusFirstError(formik: FormikPartialType) {
  const prevSubmitCountRef = useRef(formik.submitCount)
  const fieldsRef = useRef<{ [key: string]: HTMLInputElement }>({})
  const firstInvalidKey = Object.keys(formik.errors)[0]

  useEffect(() => {
    if (prevSubmitCountRef.current !== formik.submitCount && !formik.isValid) {
      const firstInvalidRef = fieldsRef.current[firstInvalidKey]
      if (firstInvalidRef) {
        firstInvalidRef.focus()
      }
    }
  }, [formik.isValid, formik.submitCount, firstInvalidKey])

  return (elem: HTMLInputElement) => {
    if (elem) {
      fieldsRef.current[elem.name] = elem
    }
  }
}
