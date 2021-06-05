import classnames from "classnames"
import { useField } from "formik"
import React from "react"
import "./TextInput.module.css"

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
        className="block w-full rounded-lg c-form-element-border"
        styleName={classnames({ invalid: invalid })}
        {...otherProps}
      />
    )
  }
)
export default TextInput
