import { useEffect, useRef, useState } from "react"
import { FormikErrors } from "formik"

export function useStateList<T>(stateList: T[]) {
  const [current, setCurrent] = useState(0)
  const movePrevious = () => setCurrent(c => (c > 0 ? c - 1 : c))
  const moveNext = () => setCurrent(c => (c < stateList.length - 1 ? c + 1 : c))
  const isAfter = (state: T) => {
    const reference = stateList.indexOf(state)
    if (reference === -1) {
      throw new Error(`could not find ${state} in ordered states`)
    }
    return current >= reference
  }

  return {
    state: stateList[current],
    movePrevious,
    moveNext,
    isAfter,
  }
}

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
