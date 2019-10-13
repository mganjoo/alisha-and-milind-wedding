import React from "react"
import classnames from "classnames"

function getBaseClassName(inputType: string | undefined) {
  switch (inputType) {
    case "text":
      return "form-input"
    case "email":
      return "form-input"
    default:
      return null
  }
}

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  invalid?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, className, invalid, ...otherProps }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={classnames(
          "mt-1 block w-full",
          getBaseClassName(type),
          { "c-input-invalid": invalid },
          className
        )}
        {...otherProps}
      />
    )
  }
)
export default Input
