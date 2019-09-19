import { useState, useRef } from "react"

export const EmailValidator = {
  validate: value => !/\S+@\S+\.\S+/.test(value),
  message: _ => `A valid email is required.`,
}

export const RequiredValidator = {
  validate: value => value && value.length > 0,
  message: label => `${label} is required.`,
}

function makeMap(keys, fn) {
  return keys.reduce((map, k) => {
    map[k] = fn(k)
    return map
  }, {})
}

export function useForm(names, validators, submitCallback) {
  const [values, setValues] = useState(makeMap(names, _ => ""))
  const [dirty, setDirty] = useState(makeMap(names, _ => false))
  const [submitting, setSubmitting] = useState(false)
  const fieldsRef = useRef({})
  const validate = (name, value) =>
    validators[name].every(validator => validator.validate(value))

  return {
    values: values,
    dirty: dirty,
    submitting: submitting,
    handleChange: event => {
      const name = event.target.name
      const value = event.target.value
      setValues({ ...values, [name]: value })

      // Clear the dirty state for field if current input is valid
      if (validate(name, value)) {
        setDirty({ ...dirty, [name]: false })
      }
    },
    handleBlur: event => {
      const name = event.target.name
      // Mark as dirty if user has navigated away from an invalid field
      setDirty({ ...dirty, [event.target.name]: !validate(name, values[name]) })
    },
    handleSubmit: _ => {
      if (Object.keys(values).every(name => validate(name, values[name]))) {
        setSubmitting(true)
        submitCallback(values)
          .then(() => setSubmitting(false))
          .then(
            () => {
              // Reset form on success
              setValues(makeMap(names, _ => ""))
              setDirty({})
            }
            // TODO: set form-level error here
          )
      } else {
        // Bulk mark all invalid fields as dirty
        setDirty(makeMap(names, name => !validate(name, values[name])))
        const firstInvalidName = names.find(
          name => !validate(name, values[name])
        )
        if (fieldsRef.current[firstInvalidName]) {
          fieldsRef.current[firstInvalidName].focus()
        }
      }
    },
    // Sets references to <input> elements as they are
    // mounted in the DOM (for focusing purposes)
    registerRef: element => {
      if (element && element.name) {
        fieldsRef.current[element.name] = element
      }
    },
  }
}
