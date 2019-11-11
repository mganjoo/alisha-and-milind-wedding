import React from "react"
import classnames from "classnames"
import { useField } from "formik"

interface TextInputProps
  extends React.DetailedHTMLProps<
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "name">,
    HTMLInputElement
  > {
  name: string
  type: "text" | "email"
  invalid?: boolean
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ type, className, invalid, name, ...otherProps }, ref) => {
    const [field] = useField<string>(name)
    return (
      <input
        {...field}
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
