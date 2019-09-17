import React, { useState, useRef } from "react"
import PropTypes from "prop-types"
import FormInput from "./FormInput"
import validator from "email-validator"

export const EmailValidator = {
  validate: value => validator.validate(value),
  message: _ => `A valid email is required.`,
}

export const RequiredValidator = {
  validate: value => value && value.length > 0,
  message: label => `${label} is required.`,
}

// Returns an object with the `name` fields from
// fieldConfigs as keys, and fn(fieldConfig) as values.
function makeFieldsMap(fieldConfigs, fn) {
  return fieldConfigs.reduce((map, fieldConfig) => {
    map[fieldConfig.name] = fn(fieldConfig)
    return map
  }, {})
}

function validate(fieldConfig, value) {
  return fieldConfig.validator.validate(value)
}

function resetValues(fieldConfigs) {
  return makeFieldsMap(fieldConfigs, _ => "")
}

function resetDirty(fieldConfigs) {
  return makeFieldsMap(fieldConfigs, _ => false)
}

function Form({ fieldConfigs, handleSubmit, disabled }) {
  const [values, setValues] = useState(resetValues(fieldConfigs))
  const [dirty, setDirty] = useState(resetDirty(fieldConfigs))
  const [submissionStatus, setSubmissionStatus] = useState(null)
  const fieldRefs = useRef(makeFieldsMap(fieldConfigs, _ => null))

  const changeHandlers = makeFieldsMap(fieldConfigs, config => event => {
    const value = event.target.value
    setValues({ ...values, [config.name]: value })

    // If (and only if) the current input is valid, clear dirty state for field
    if (validate(config, value) && dirty[config.name]) {
      setDirty({ ...dirty, [config.name]: false })
    }
  })
  const blurHandlers = makeFieldsMap(fieldConfigs, config => _ => {
    setDirty({
      ...dirty,
      // Field is dirty if it is invalid after blur
      [config.name]: !validate(config, values[config.name]),
    })
  })
  function handleSubmitClick() {
    if (fieldConfigs.every(config => validate(config, values[config.name]))) {
      setSubmissionStatus("submitting")
      handleSubmit(values).then(
        () => {
          // Reset form
          setValues(resetValues(fieldConfigs))
          setDirty(resetDirty(fieldConfigs))
          setSubmissionStatus(null)
        },
        () => setSubmissionStatus("failed")
      )
    } else {
      // Bulk mark all invalid fields as dirty
      setDirty(
        makeFieldsMap(
          fieldConfigs,
          config => !validate(config, values[config.name])
        )
      )
      const firstInvalidFieldName = fieldConfigs.find(
        config => !validate(config, values[config.name])
      ).name
      if (fieldRefs.current[firstInvalidFieldName]) {
        fieldRefs.current[firstInvalidFieldName].focus()
      }
    }
  }

  // Sets references to <input> elements as they are
  // mounted in the DOM (for focusing purposes)
  function updateFieldRefs(element) {
    if (element && element.name) {
      fieldRefs.current[element.name] = element
    }
  }

  return (
    <div className="flex flex-col items-center px-12 pt-4 pb-6">
      {fieldConfigs.map(({ name, type, label, validator, ...otherProps }) => (
        <label
          className="flex flex-wrap justify-between w-full mt-4"
          key={name}
        >
          <span className="text-gray-700">{label}</span>
          <span aria-live="polite" className="text-red-600">
            {dirty[name] ? validator.message(label) : ""}
          </span>
          <FormInput
            name={name}
            type={type}
            value={values[name]}
            onChange={changeHandlers[name]}
            onBlur={blurHandlers[name]}
            error={dirty[name]}
            ref={updateFieldRefs}
            {...otherProps}
          />
        </label>
      ))}
      <button
        className="button mt-6"
        disabled={disabled || submissionStatus === "submitting"}
        onClick={handleSubmitClick}
      >
        {submissionStatus === "submitting" ? "Submitting..." : "Submit info"}
      </button>
    </div>
  )
}

Form.propTypes = {
  fieldConfigs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.string,
      type: PropTypes.string,
      validator: PropTypes.object,
    })
  ),
  handleSubmit: PropTypes.func,
  disabled: PropTypes.bool,
}

Form.defaultProps = {
  disabled: false,
}

export default Form
