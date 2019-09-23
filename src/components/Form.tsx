import { useState, useRef, FocusEvent, ChangeEvent, FormEvent } from "react"

interface Validator {
  (value: string): boolean
}
export const EmailValidator: Validator = value => /\S+@\S+\.\S+/.test(value)
export const RequiredValidator: Validator = value => value.length > 0

export type FieldsMap = {
  [key: string]: { validators: Validator[]; initialValue?: string }
}

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

type FormElement = HTMLInputElement | HTMLSelectElement | null

export type SubmissionMap = { [key: string]: string }

export function useForm(
  fields: FieldsMap,
  submitCallback: (t: SubmissionMap) => Promise<void>
) {
  const names = Object.keys(fields)
  const resetValues = () =>
    makeKeyedObject(names, name => fields[name].initialValue || "")
  const [values, setValues] = useState(resetValues())
  const [dirty, setDirty] = useState(makeKeyedObject(names, () => false))
  const [submitting, setSubmitting] = useState(false)
  const fieldsRef = useRef<KeyedObject<FormElement>>({})
  const validate = (name: string, value: string) =>
    !fields[name].validators ||
    fields[name].validators.every(validator => validator(value))
  function checkName(name: string) {
    if (!names.includes(name)) {
      throw new Error(`Form was never configured with field '${name}'`)
    }
  }

  return {
    values: values,
    dirty: dirty,
    submitting: submitting,
    handleChange: (event: ChangeEvent<FormElement>) => {
      if (event && event.target) {
        const name = event.target.name
        checkName(name)
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
      checkName(name)
      // Mark as dirty if user has navigated away from an invalid field
      setDirty({ ...dirty, [event.target.name]: !validate(name, values[name]) })
    },
    handleSubmit: (event: FormEvent<HTMLFormElement>) => {
      // We'll handle the submission
      event.preventDefault()

      // Bulk mark all invalid fields as dirty
      const newDirty = makeKeyedObject(
        names,
        name => !validate(name, values[name])
      )
      setDirty(newDirty)
      const firstInvalidName = names.find(name => newDirty[name])

      if (firstInvalidName === undefined) {
        setSubmitting(true)
        submitCallback(values)
          .then(() => setSubmitting(false))
          .then(() => {
            // Reset form on success
            setValues(resetValues())
            setDirty({})
          })
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
        checkName(element.name)
        fieldsRef.current[element.name] = element
      }
    },
  }
}
