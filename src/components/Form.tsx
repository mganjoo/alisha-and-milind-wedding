import { useState, useRef, FocusEvent, ChangeEvent } from "react"

interface Validator {
  (value: string): boolean
}

export const EmailValidator: Validator = value => /\S+@\S+\.\S+/.test(value)
export const RequiredValidator: Validator = value => value.length > 0

interface KeyedObject<T> {
  [key: string]: T
}

function makeKeyedObject<T>(
  keys: string[],
  fn: (t: string) => T
): { [key: string]: T } {
  return keys.reduce(
    (map, k) => {
      map[k] = fn(k)
      return map
    },
    {} as KeyedObject<T>
  )
}

type FormElement = HTMLInputElement | HTMLTextAreaElement | null

export function useForm(
  names: string[],
  validators: { [key: string]: Validator[] },
  submitCallback: (t: { [key: string]: string }) => Promise<void>
) {
  const [values, setValues] = useState(makeKeyedObject(names, () => ""))
  const [dirty, setDirty] = useState(makeKeyedObject(names, () => false))
  const [submitting, setSubmitting] = useState(false)
  const fieldsRef = useRef<KeyedObject<FormElement>>({})
  const validate = (name: string, value: string) =>
    validators[name].every(validator => validator(value))

  return {
    values: values,
    dirty: dirty,
    submitting: submitting,
    handleChange: (event: ChangeEvent<FormElement>) => {
      if (event && event.target) {
        const name = event.target.name
        const value = event.target.value
        setValues({ ...values, [name]: value })

        // Clear the dirty state for field if current input is valid
        if (validate(name, value)) {
          setDirty({ ...dirty, [name]: false })
        }
      }
    },
    handleBlur: (event: FocusEvent<FormElement>) => {
      const name = event.target.name
      // Mark as dirty if user has navigated away from an invalid field
      setDirty({ ...dirty, [event.target.name]: !validate(name, values[name]) })
    },
    handleSubmit: () => {
      // Bulk mark all invalid fields as dirty
      setDirty(makeKeyedObject(names, name => !validate(name, values[name])))
      const firstInvalidName = names.find(name => dirty[name])

      if (firstInvalidName === undefined) {
        setSubmitting(true)
        submitCallback(values)
          .then(() => setSubmitting(false))
          .then(
            () => {
              // Reset form on success
              setValues(makeKeyedObject(names, () => ""))
              setDirty({})
            }
            // TODO: set form-level error here
          )
      } else {
        const firstInvalidField = fieldsRef.current[firstInvalidName]
        if (firstInvalidField && firstInvalidField.focus) {
          firstInvalidField.focus()
        }
      }
    },
    // Sets references to <input> elements as they are
    // mounted in the DOM (for focusing purposes)
    registerRef: (element: FormElement) => {
      if (element) {
        fieldsRef.current[element.name] = element
      }
    },
  }
}
