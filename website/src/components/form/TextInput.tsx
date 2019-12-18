import React from "react"
import { useField } from "formik"
import "./TextInputGroup.module.css"
import classnames from "classnames"

interface TextInputProps
  extends React.DetailedHTMLProps<
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "type" | "name" | "className"
    >,
    HTMLInputElement
  > {
  name: string
  type: "text" | "email"
  invalid?: boolean
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ type, invalid, name, ...otherProps }, ref) => {
    const [field] = useField<string>(name)
    return (
      <input
        {...field}
        ref={ref}
        type={type}
        className="block w-full form-input"
        styleName={classnames({ invalid: invalid })}
        {...otherProps}
      />
    )
  }
)
export default TextInput
