import { useState, useRef, FocusEvent, ChangeEvent, FormEvent } from "react"
import { Predicate } from "./Predicate"

/**
 * Interface for a function that tests a value and
 * returns an error message.
 */
export interface Validator {
  (value: string): string | null
}

/**
 * A [[Validator]] that tests a single predicate.
 *
 * @param predicate the condition to test
 * @param message the error message to return if the condition is not met
 */
export function SimpleValidator(
  predicate: Predicate,
  message: string
): Validator {
  return (value: string) => (!predicate(value) ? message : null)
}

export type FieldConfig = { name: string; validator?: Validator }
export type SubmissionMap = { [key: string]: string }

function makeFieldMap<T>(
  fields: FieldConfig[],
  fn: (t: FieldConfig) => T
): { [key: string]: T } {
  return fields.reduce(
    (map, field) => {
      map[field.name] = fn(field)
      return map
    },
    {} as { [key: string]: T }
  )
}

type FormElement = HTMLInputElement | HTMLSelectElement | null

export function useForm(
  fields: FieldConfig[],
  submitCallback: (t: SubmissionMap) => Promise<void>
) {
  const validators = makeFieldMap(fields, f => f.validator)
  function checkName(name: string) {
    if (!fields.some(field => field.name === name)) {
      throw new Error(`Form was never configured with field '${name}'`)
    }
  }

  const resetValues = () => makeFieldMap(fields, () => "")
  const resetErrors = () => makeFieldMap<string | null>(fields, () => null)
  const [values, setValues] = useState(resetValues())
  const [errors, setErrors] = useState(resetErrors())
  const fieldsRef = useRef<{ [key: string]: FormElement }>({})
  const getError = (name: string, value: string) => {
    const validator = validators[name]
    return validator ? validator(value) : null
  }

  return {
    values: values,
    errors: errors,
    handleChange: (event: ChangeEvent<FormElement>) => {
      if (event && event.target) {
        const name = event.target.name
        checkName(name)
        const value = event.target.value
        setValues({ ...values, [name]: value })

        // Clear the errors state for field if current input is valid
        const error = getError(name, value)
        if (!error) {
          setErrors({ ...errors, [name]: null })
        }
      }
    },
    handleBlur: (event: FocusEvent<FormElement>) => {
      const name = event.target.name
      checkName(name)
      // Update errors if user has navigated away from an invalid field
      setErrors({
        ...errors,
        [event.target.name]: getError(name, values[name]),
      })
    },
    handleSubmit: (event: FormEvent<HTMLFormElement>) => {
      // We'll handle the submission instead of form default
      event.preventDefault()

      // Bulk mark all invalid fields as errors
      const newErrors = makeFieldMap(fields, field =>
        getError(field.name, values[field.name])
      )
      setErrors(newErrors)
      const firstInvalidField = fields.find(
        field => newErrors[field.name] !== null
      )

      if (firstInvalidField === undefined) {
        // Submit form if all fields are valid
        submitCallback(values)
      } else {
        // Focus first invalid field if at least one field is invalid
        const firstInvalidRef = fieldsRef.current[firstInvalidField.name]
        if (firstInvalidRef) {
          firstInvalidRef.focus()
        }
      }
    },
    // Sets references to <input> elements as they are
    // mounted in the DOM, so we can focus them
    registerRef: (element: FormElement) => {
      if (element) {
        checkName(element.name)
        fieldsRef.current[element.name] = element
      }
    },
  }
}
