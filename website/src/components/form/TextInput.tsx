import React from "react"
import classnames from "classnames"

interface TextInputProps
  extends React.DetailedHTMLProps<
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
    HTMLInputElement
  > {
  type: "text" | "email"
  invalid: boolean
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ type, className, invalid, ...otherProps }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={classnames(
          "block w-full form-input",
          { "c-input-invalid": invalid },
          className
        )}
        {...otherProps}
      />
    )
  }
)
export default TextInput
