import React from "react"
import PropTypes from "prop-types"

const FormInput = React.forwardRef(({ type, error, ...otherProps }, ref) => {
  const baseClassName = `form-base${error ? " form-invalid" : ""}`
  const otherPropsWithRef = { ...otherProps, ref: ref }
  switch (type) {
    case "text":
      return (
        <input
          type="text"
          className={`form-input ${baseClassName}`}
          {...otherPropsWithRef}
        />
      )
    case "email":
      return (
        <input
          type="email"
          className={`form-input ${baseClassName}`}
          ref={ref}
          {...otherPropsWithRef}
        />
      )
    case "textarea":
      return (
        <textarea
          className={`form-textarea resize-none ${baseClassName}`}
          ref={ref}
          {...otherPropsWithRef}
        />
      )
    default:
      throw new Error(`Unsupported field type ${type}`)
  }
})

FormInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["text", "email", "textarea"]).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.bool,
  rows: function(props, propName, componentName) {
    // rows prop is only applicable to <textarea>
    if (props[propName] !== undefined && props["type"] !== "textarea") {
      return new Error(
        `Invalid property ${propName} provided to ${componentName} of type ${
          props["type"]
        }`
      )
    }
  },
}

export default FormInput
