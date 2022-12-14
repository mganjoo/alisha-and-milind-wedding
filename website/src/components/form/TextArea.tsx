import classNames from "classnames"
import { useField } from "formik"
import React from "react"
import { input, invalid as invalid_style } from "./TextInput.module.css"

interface TextAreaProps
  extends React.DetailedHTMLProps<
    Omit<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      "name" | "className"
    >,
    HTMLTextAreaElement
  > {
  name: string
  invalid?: boolean
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ invalid, name, ...otherProps }, ref) => {
    const [field] = useField<string>(name)
    return (
      <textarea
        {...field}
        ref={ref}
        className={classNames("resize-none c-form-element-border", input, {
          [invalid_style]: invalid,
        })}
        {...otherProps}
      />
    )
  }
)
export default TextArea
